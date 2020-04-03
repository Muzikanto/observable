## Observable and Observable-form

[![dependencies Status](https://david-dm.org/muzikanto/observable/status.svg)](https://david-dm.org/muzikanto/observable)
[![size](https://img.shields.io/bundlephobia/minzip/@muzikanto/observable)](https://bundlephobia.com/result?p=@muzikanto/observable)

<!-- TOC -->

- [Introduction](#introduction)
- [Installation](#installation)
- [Examples](#examples)
  - [change with Event](#change-with-event)
  - [subscribe two stores (React)](#subscribe-two-stores)
  - [Create form with validation](#create-form-with-validation)
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
### Change with Event

```typescript jsx
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

---

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

### Create form with validation

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
    // create 
    const store = createStore<number>(1);
    // multiple watch changes 
    store.watch(console.log);
```

### createEvent

```typescript
    // create 
    const event = createEvent<number>();
    // call
    event(1);
    // subscribe in store
    const unwatchFunc = store.on(event, (state: StoreState, payload: number) => {
       // todo
       return payload; 
    });
    // Unwatch event
    unwatchFunc();
```

### createEffect

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

### createApi
```typescript jsx
    const api = createApi(1, {
        increment: (state, payload: number) => state + payload,
        change: (state, payload: string) => payload.length,
    });
    
    api.increment(2);
    api.change('test');

    /*
        {
            store: Store<number>,
            increment: IEvent<number>,
            change: IEvent<string>,
        }
     */
```

### combine
```typescript jsx
     const one = createStore('Hello ');
     const two = createStore('World');
 
     const combinedStore = combine({
         map: {one, two},
         func: ({one, two}) => {
             return one + ' ' + two;
         },
     });
     
     combinedStore.get(); // Hello World
```

### forward
```typescript jsx
    const one = createEvent<number>();
    const two = createEvent<number>();
    
    two.watch(console.log);

    forward(one, two);
    
    one(3); // log: 3
````

### createForm
with yup validation

```typescript jsx
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

## License

[MIT](LICENSE)
