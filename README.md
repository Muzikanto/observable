## Observable

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
   -  [combineAsync](#example-combineasync)
   -  [createApi](http://github.com/Muzikanto/observable/tree/master/examples/create_api.tsx)
   -  [listen object value](http://github.com/Muzikanto/observable/tree/master/examples/listen_object_value.tsx)
-  [API](#api)
   -  [createStore](#createstore)
   -  [createEvent](#createevent)
   -  [createEffect](#createeffect)
   -  [createApi](#createapi)
   -  [combine](#combine)
   -  [combineAsync](#combineasync)
   -  [forward](#forward)
   -  useStore
   -  StoreConsumer
   -  connect
   -  isEvent
   -  isStore
-  [License](#license)

<!-- /TOC -->

## Linked projects

| name                       | version                                                                                                                                                  | downloads                                                                                                                                                |
| -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `observable-global`        | [![npm version](https://badge.fury.io/js/%40muzikanto%2Fobservable-global.svg)](https://badge.fury.io/js/%40muzikanto%2Fobservable-global)               | [![downloads](https://img.shields.io/npm/dm/@muzikanto/observable-global.svg)](https://www.npmjs.com/package/@muzikanto/observable-global)               |
| `observable-persist`       | [![npm version](https://badge.fury.io/js/%40muzikanto%2Fobservable-persist.svg)](https://badge.fury.io/js/%40muzikanto%2Fobservable-persist)             | [![downloads](https://img.shields.io/npm/dm/@muzikanto/observable-persist.svg)](https://www.npmjs.com/package/@muzikanto/observable-persist)             |
| `observable-form`          | [![npm version](https://badge.fury.io/js/%40muzikanto%2Fobservable-form.svg)](https://badge.fury.io/js/%40muzikanto%2Fobservable-form)                   | [![downloads](https://img.shields.io/npm/dm/@muzikanto/observable-form.svg)](https://www.npmjs.com/package/@muzikanto/observable-form)                   |
| `observable-form-material` | [![npm version](https://badge.fury.io/js/%40muzikanto%2Fobservable-form-material.svg)](https://badge.fury.io/js/%40muzikanto%2Fobservable-form-material) | [![downloads](https://img.shields.io/npm/dm/@muzikanto/observable-form-material.svg)](https://www.npmjs.com/package/@muzikanto/observable-form-material) |

## Introduction

-  create store
-  listen store changes
-  listen store object part change
-  create event and subscribe store to event
-  create effect and subscribe events (done, fail, loading)
-  async store parts with combineAsync
-  override Event, Effect, Store if you need
-  and more..

## Installation

```sh
npm i @muzikanto/observable
# or
yarn add @muzikanto/observable
```

## Migrate 3.x.x > 4.x.x

remove to [@muzikanto/observable-global](https://www.npmjs.com/package/@muzikanto/observable-global)

-  createGlobalStore
-  GlobalStoreCtx
-  GlobalStoreProvider
-  useGlobal

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
   .then((response) => console.log(response))
   .catch((err) => console.log(err));
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

### example combineAsync

```typescript jsx
const one = createStore(1);
const two = createStore(2);
const three = createStore(3);

const combinedStore = combineAsync({ one, two });

combinedStore.get(); // { one: 1, two: 2 }

combinedStore.injectStore('three', three);

combinedStringStore.get(); // { one: 1, two: 2, three: 3 }
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
  watch: (handler: (state: T, prev: T) => void): () => void;
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

type Api<S, A extends { [key: string]: (store: Store<S>, payload: any) => S }> = ApiEvents<S, A> & {
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
): CombineStore<S>;
```

### combineAsync

```typescript jsx
function combineAsync<Map extends { [key: string]: any }, S = Map>(
   map: { [k in keyof Map]: Store<Map[k]> },
   func?: (map: Map) => S,
): CombineAsyncStore<S>;
```

### forward

```typescript jsx
function forward<P>(
   from: IEvent<P>,
   to: IEvent<P> | Array<IEvent<P>>,
): (() => void) | Array<() => void>;
```

### useStore

```typescript jsx
function useStore<T, V>(observable: Store<T>, selector?: (state: T) => V): V;
```

## License

[MIT](LICENSE)
