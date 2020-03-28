## Observer Observer-form

### Store

base
```typescript jsx
  import useStore from "@muzikanto/observable/lib/useStore";
  import createStore from "@muzikanto/observable/lib/createStore";
  import createEvent from "@muzikanto/observable/lib/createEvent";

  const store = createStore<number>(1);
  
  const add = createEvent<number>();
  const remove = createEvent<number>();
  
  store.on(add, (state, payload) => {
     return state + payload;
  });
  store.on(remove, (state, payload) => {
      return state - payload;
  });

  function Component() {
    const state = useStore(store);
    
    const onAdd = () => add(2);
    const onRemove = () => remove(1);
    const onReset = () => store.reset();
    
    return (
        <>
            <div>{state}</div>
            <button onClick={onAdd}>add</button>
            <button onClick={onRemove}>remove</button>
            <button onClick={onReset}>reset</button>
        </>
    );
  }
```

advanced
```typescript jsx
  import useSelector from "@muzikanto/observable/lib/useSelector";
  import createStore from "@muzikanto/observable/lib/createStore";
  import createEvent from "@muzikanto/observable/lib/createEvent";

  const store = createStore({one: 1, two: 2});
  
  const addOne = createEvent<number>();
  const addTwo = createEvent<number>();
  
  const off1 = store.on(addOne, (state, payload) => {
     return {...state, one: state.one + payload}
  });
  const off2 = store.on(addTwo, (state, payload) => {
     return {...state, two: state.two + payload}
  });
  
  const unWatch = store.watch(console.log);

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
            <button onClick={() => addOne(1)}>add-one</button>
            <button onClick={() => addTwo(2)}>add-two</button>
          </>
      );
  }
  
  /*
       click: add-one
            render only: OnePreview
       click: add-two
            render only: TwoPreview
  */
```
 
----------
### Form

createForm
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

create Fields
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

example use
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