## Observable and Observable-form

[![npm version](https://badge.fury.io/js/%40muzikanto%2Fobservable.svg)](https://badge.fury.io/js/%40muzikanto%2Fobservable)
[![downloads](https://img.shields.io/npm/dm/@muzikanto/observable.svg)](https://www.npmjs.com/package/@muzikanto/observable)
[![dependencies Status](https://david-dm.org/muzikanto/observable/status.svg)](https://david-dm.org/muzikanto/observable)
[![size](https://img.shields.io/bundlephobia/minzip/@muzikanto/observable)](https://bundlephobia.com/result?p=@muzikanto/observable)
![Code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)

<!-- TOC -->

-  [Introduction](#introduction)
-  [Installation](#installation)
-  [Examples](#examples)
   -  [base](http://github.com/Muzikanto/observable/tree/master/examples/base.tsx)
   -  [listen store](http://github.com/Muzikanto/observable/tree/master/examples/listen_store.tsx)
   -  [request to api](http://github.com/Muzikanto/observable/tree/master/examples/request_to_api.tsx)
   -  [watch store, event](http://github.com/Muzikanto/observable/tree/master/examples/watch_changes.tsx)
   -  [combine](http://github.com/Muzikanto/observable/tree/master/examples/combine_stores.tsx)
   -  [createApi](http://github.com/Muzikanto/observable/tree/master/examples/create_api.tsx)
   -  [listen object value](http://github.com/Muzikanto/observable/tree/master/examples/listen_object_value.tsx)
   -  [createForm](http://github.com/Muzikanto/observable/tree/master/examples/form_with_validate)
-  [API](#api)
   -  [createStore](#createstore)
   -  [createEvent](#createevent)
   -  [createEffect](#createeffect)
   -  [createApi](#createapi)
   -  useStore
   -  useSelector
   -  StoreConsumer
   -  connect
   -  [combine](#combine)
   -  [forward](#forward)
   -  Portal
   -  ErrorBoundary
   -  GlobalStore
      -  createGlobalStore
      -  GlobalStoreCtx
      -  useGlobal
   -  Form
      -  [createForm](#createform)
      -  Form
      -  useField
      -  useFieldArray
      -  ErrorMessage
-  [License](#license)

<!-- /TOC -->

## Introduction

-  create store
-  listen store changes
-  listen store object part change
-  create event and subscribe store to event
-  create effect and subscribe events (done, fail, loading)
-  create form with yup validation
-  create your fields (partial rendering)
-  override Event, Effect, Store if you need
-  and more..

## Installation

```sh
npm i @muzikanto/observable
# or
yarn add @muzikanto/observable
```

## Examples

[More examples](http://github.com/Muzikanto/observable/tree/master/examples)

### example createStore

```typescript jsx
const store = createStore<number>({ value: 1 });

function Component() {
   const state = useStore(store); // {value: 1};
   // const value = useStore(store, s => s.value);

   return <span>{state.value}</span>;
}
```

### example createEvent

```typescript
import createStore from '@muzikanto/observable/lib/createStore';
import createEvent from '@muzikanto/observable/lib/createEvent';

const store = createStore<number>(1);
const append = createEvent<number>();
const change = createEvent<number>();

store.on(append, (state, payload) => state + payload);
store.on(change, (state, payload) => payload);

append(2); // 3
change(-2); // -2
store.reset(); // 1
```

[Run in CodeBox](https://codesandbox.io/s/romantic-thunder-446dc)

### example createEffect

```typescript
type Request = { param: number };

// create
const effect = createEffect<Request, Response, Error>(async (params: Request) => {
   try {
      const response = await axios.get('https://example.com', { params });

      return response;
   } catch (e) {
      throw e;
   }
});

// subscribe in store
storeDone.on(effect.done, (_, payload) => payload);
storeFail.on(effect.fail, (_, payload) => payload);
storeLoading.on(effect.loading, (_, payload) => payload);

// call
event({ param: 1 })
   .then(response => console.log(response))
   .catch(err => console.log(err));
```

### example combine

```typescript jsx
const one = createStore('Hello ');
const two = createStore('World');

const combinedObjStore = combine({ one, two });

combinedObjStore.get(); // { one: 'Hello ', two: 'World' }

const combinedStringStore = combine({ one, two }, ({ one, two }) => {
   return one + ' ' + two;
});

combinedStringStore.get(); // Hello World
```

## Api

### createStore

```typescript
function createStore<T>(initialState: T): Store<T>

interface Store<T> {
  get: () => T;
  set: (v: T) => void;
  subscribe: (listener: Listener<any>, selector?: (state: T) => any) =>() => void;
  reset: () => void;
  on: <P>(event: IEvent<P>, handler: (state: T, payload: P) => T) => () => void;
  watch: (handler: (state: T) => void): () => void;
}
```

### createEvent

```typescript
function createEvent<P = void>(): IEvent<P>;

type IEvent<P = void> = {
   (payload: P): void;
   watch: (watcher: Listener<P>) => () => void;
};
```

### createEffect

```typescript
function createEffect<Req, Res, Err = Error>(
   handler: (params: Req) => Promise<Res>,
): IEffect<Req, Res, Err>;

type IEffect<Req, Res, Err = Error> = {
   (request: Req): Promise<Res>;
   done: IEvent<Res>;
   fail: IEvent<Err>;
   loading: IEvent<boolean>;
};
```

### createApi

```typescript jsx
function createApi<S, A extends { [key: string]: (state: S, payload: any) => S }>(
   state: S,
   api: A,
): Api<S, A>;

type Api<S, A extends { [key: string]: (state: S, payload: any) => S }> = ApiEvents<S, A> & {
   store: Store<S>;
};

type ApiEvents<S, A> = {
   [K in keyof A]: A[K] extends (store: S, e: infer E) => S ? IEvent<E> : any;
};
```

### combine

```typescript jsx
function combine<Map extends { [key: string]: any }, S = Map>(
   map: { [k in keyof Map]: Store<Map[k]> },
   func?: (map: Map) => S,
): Store<S>;
```

### forward

```typescript jsx
function forward<P>(
   from: IEvent<P>,
   to: IEvent<P> | Array<IEvent<P>>,
): (() => void) | (Array<() => void>);
```

### createForm

with yup validation

```typescript jsx
function createForm<State extends object>(params: FormParams<State>): FormConfig<State>;

interface FormParams<State extends object> {
   initialState: State;
   initialErrors?: FormErrors<State>;
   initialTouched?: FormTouched<State>;
   validationSchema?: Schema<Partial<State>>; // Schema => yup.Schema

   validateOnCreate?: boolean;

   onSubmit?: (state: State) => void;
}

interface FormConfig<State extends object> {
   values: Store<State>;
   errors: Store<FormErrors<State>>;
   touched: Store<FormTouched<State>>;
   isValid: Store<boolean>;

   setValue: IEvent<{ key: string; value: any; validate?: boolean }>;
   setError: IEvent<{ key: string; value: string | undefined }>;
   setTouched: IEvent<{ key: string; value: boolean }>;

   submit: IEvent<void>;
   reset: IEvent<void>;
   validate: IEvent<void>;
   validateAt: (key: string) => void;
}
```

### useStore

```typescript jsx
function useStore<T>(observable: Store<T>): T;
```

### useSelector

```typescript jsx
function useSelector<T, V>(observable: Observable<T>, selector: (state: T) => V): V;
```

## License

[MIT](LICENSE)
