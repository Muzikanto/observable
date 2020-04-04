## Observable and Observable-form

[![dependencies Status](https://david-dm.org/muzikanto/observable/status.svg)](https://david-dm.org/muzikanto/observable)
[![size](https://img.shields.io/bundlephobia/minzip/@muzikanto/observable)](https://bundlephobia.com/result?p=@muzikanto/observable)

<!-- TOC -->

- [Introduction](#introduction)
- [Installation](#installation)
- [Examples](#examples)
  - [createStore](#example-createstore)
  - [createEvent](#example-createevent)
  - [createEffect](#example-createeffect)
  - [createApi](#example-createapi)
  - [combine](#example-combine)
  - [forward](#example-forward)
  - [Portal](#example-portal)
  - [createForm](#example-createform)
  - [change with Event](#change-with-event)
  - [subscribe two stores (React)](#subscribe-two-stores)
  - [Create form Fields](#create-form-fields)
  - [Use Form and Fields](#use-form-and-fields)
- [API](#api)
  - [createStore](#createstore)
  - [createEvent](#createevent)
  - [createEffect](#createeffect)
  - [createApi](#createapi)
  - [combine](#combine)
  - [forward](#forward)
  - [createForm](#createform)
- [License](#license)

<!-- /TOC -->

## Introduction

- create store
- listen store changes
- listen store object part change
- create event and subscribe store to event
- create effect and subscribe events (done, fail, loading)
- create form with yup validation 
- create your fields (partial rendering)
- override Event, Effect, Observable if you need

## Installation

```sh
npm i @muzikanto/observable
# or
yarn add @muzikanto/observable
```

## Examples

### example createStore

```typescript
    // create 
    const store = createStore<number>(1);
    // multiple watch changes 
    const unWatchFunc = store.watch(console.log);
```

### example createEvent

```typescript
  import createStore from "@muzikanto/observable/lib/createStore";
  import createEvent from "@muzikanto/observable/lib/createEvent";

  const store = createStore<number>(1);
  const append = createEvent<number>();
  const change = createEvent<number>();

  store.on(append, (state, payload) => state + payload);
  store.on(append, (state, payload) => payload);
  
  append(2); // 3
  change(-2); // -2
  store.reset(); // 1
```

[Run in CodeBox](https://codesandbox.io/s/romantic-thunder-446dc)

### example createEffect

```typescript
    type Request = {param: number};

    // create 
    const effect = createEffect<Request, Response, Error>(async (params: Request) => {
        try {
            const response = await axios.get('https://example.com', {params});
                    
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
    event({param: 1})
        .then(response => console.log(response))
        .catch(err => console.log(err));
```

### example createApi
```typescript jsx
    const api = createApi(1, {
        increment: (state, payload: number) => state + payload,
        change: (state, payload: string) => payload.length,
    });
    
    api.increment(2);
    api.change('test');
```

### example combine 

```typescript jsx
     const one = createStore('Hello ');
     const two = createStore('World');
 
     const combinedStringStore = combine(
        {one, two},
        ({one, two}) => {
             return one + ' ' + two;
         },
     );
     
     combinedStringStore.get(); // Hello World
```

### example forward
```typescript jsx
    const one = createEvent<number>();
    const two = createEvent<number>();
    
    two.watch(console.log);

    forward(one, two);
    
    one(3); // log: 3
````

### example Portal

```typescript jsx
    const store = createStore<React.ReactNode>(undefined);

    // portaled from 
    function Component() {
      return (
        <Portal store={store} disablePortal={disablePortal}>
           <div>portaled component</div>
        </Portal>
      );
    }
    
    // portaled to 
    function Component2() {
      const children = useStore(store);
      
      return children;
    }
```

### Subscribe two stores

```typescript jsx
  import useSelector from "@muzikanto/observable/lib/useSelector";
  import createStore from "@muzikanto/observable/lib/createStore";
  import createEvent from "@muzikanto/observable/lib/createEvent";

  const store = createStore({one: 1, two: 2});
  const appendOne = createEvent<number>();
  const appendTwo = createEvent<number>();

  const unWatchAppendOne = store.on(appendOne, (state, payload) => {
     return {...state, one: state.one + payload}
  });
  const unWatchAppendTwo = store.on(appendOne, (state, payload) => {
     return {...state, two: state.two + payload}
  });
  const unWatchLog = store.watch(console.log);
  
  const onClickUnwatch = () => {
      unWatchAppendOne();
      unWatchAppendTwo();
      unWatchLog();
  }

  function OnePreview() {
    const state: number = useSelector(store, (state) => state.one);

    return (
        <div>{state}</div>
    );
  }
  
  function TwoPreview() {
      const state: number = useSelector(store, (state) => state.two);

      return (
          <div>{state}</div>
      );
    }
    
  function Main() {
      return (
          <>
            <OnePreview/>
            <TwoPreview/>
            <button onClick={() => appendOne(1)}>append-one</button>
            <button onClick={() => appendTwo(2)}>append-two</button>
            <button onClick={onClickUnwatch}>unWatch</button>
          </>
      );
  }
  
  /*
       click: append-one
            render only: OnePreview
       click: append-two
            render only: TwoPreview
  */
```

### example createForm

```typescript jsx
    import createForm from "@muzikanto/observable/lib/createForm";
    import * as Yup from 'yup';

    interface State {
        text: string;
        field: string;
        deep: {
            one: string;
            two: string;
        };
        arr: string[];
    }
    
    const validationSchema = Yup.object().shape({
        text: Yup.string().required().max(5),
        field: Yup.string().required().max(3),
    });
    
    const form = createForm<State>({
        validateOnCreate: false,
        initialState: {
            text: '123',
            field: '',
            deep: {one: '1', two: ''},
            arr: ['1', '2', '3'],
        },
        validationSchema,
    });
```

### Create form Fields

```typescript jsx
    // useField extends useSelector
    import useField from "@muzikanto/observable/lib/useField";
    // useFieldArray extends useField
    import useFieldArray from "@muzikanto/observable/lib/useFieldArray";

    function Field(props: { name: string }) {
        const {
            value, error, touched,
            setFieldTouched, setFieldValue,
        } = useField<string>({name: props.name});

        return (
            <TextField
                value={value}
                onChange={(e) => setFieldValue(e.target.value)}
                onBlur={() => setFieldTouched(true)}
                helperText={(touched && error) && error}
                error={Boolean(touched && error)}
            />
        );
    }
    
    function FieldArray(props: { name: string }) {
        const {
            value, push, pop, swap, clear,
        } = useFieldArray<string>({name: props.name});
    
        return (
            <>
                {
                    value.map((el, i) => {
                        return (
                            <span key={i + 'test'}>{el}</span>
                        );
                    })
                }
                <Button onClick={() => push((value.length + 1).toString())}>push</Button>
                <Button onClick={() => pop()}>pop</Button>
            </>
        );
    }
```

### Use Form and Fields

```typescript jsx
    import Form from "@muzikanto/observable/lib/Form";

    function Main() {
        return (
            <Form form={form}>
               <FormTextField name="text"/>
               <FormTextField name="field"/>
               <FormTextField name="deep.one"/>
             
               <FormTextFieldArray name="arr"/>
               <Button onClick={() => form.reset()}>RESET</Button>
               <Button onClick={() => form.validate()}>VALIDATE</Button>
               <Submit
                   component={({onClick, disabled}) =>
                       <button
                           onClick={onClick}
                           disabled={disabled}>
                           Submit
                       </button>
                   }
               />
              <ErrorMessage 
                  name="field" 
                  component={(props) => <span {...props}/>}
              />
            </Form>
        );
    }
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
    function createEvent<P = void>(): IEvent<P>
    
    type IEvent<P = void> = ((payload: P) => void) & {
        watch: (watcher: Listener<P>) => () => void;
    };
```

### createEffect

```typescript
    function createEffect<Req, Res, Err = Error>(
        handler: (params: Req) => Promise<Res>,
    ): IEffect<Req, Res, Err>
    
    type IEffect<Req, Res, Err = Error> = ((request: Req) => Promise<Res>)
     & { done: IEvent<Res>; fail: IEvent<Err>; loading: IEvent<boolean> };
```

### createApi
```typescript jsx
    function createApi<S, A extends { [key: string]: (state: S, payload: any) => S }>(
        state: S,
        api: A,
    ): Api<S, A>
    
    type Api<S, A extends { [key: string]: (state: S, payload: any) => S }> =
        ApiEvents<S, A>
        & { store: Store<S>; };
    
    type ApiEvents<S, A> = {
        [K in keyof A]: A[K] extends (store: S, e: infer E) => S ? IEvent<E> : any
    }
```

### combine
```typescript jsx
     function combine<S, Map extends { [key: string]: any }>(
         map: { [k in keyof Map]: Store<Map[k]> },
         func: (map: Map) => S,
     ): Store<S>
```

### forward
```typescript jsx
    function forward<P>(from: IEvent<P>, to: IEvent<P>): () => void 
````

### createForm
with yup validation

```typescript jsx
    function createForm<State extends object>(
        params: FormParams<State>,
    ): FormConfig<State>
    
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
    
        setValue: IEvent<{ key: string; value: any; validate?: boolean; }>;
        setError: IEvent<{ key: string; value: string | undefined }>;
        setTouched: IEvent<{ key: string; value: boolean }>;
    
        submit: IEvent<void>;
        reset: IEvent<void>;
        validate: IEvent<void>;
        validateAt: (key: string) => void;
    }
  
```

## License

[MIT](LICENSE)
