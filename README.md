## Observer Observer-form

### Observer

base
```typescript jsx
  import useStore from "@muzikanto/observable/lib/useStore";
  import createStore from "@muzikanto/observable/lib/createStore";

  const store = new createStore<number>(1);

  function Component() {
    const state = useStore(store);
    
    const onAdd = () => store.set(store.get() + 1);
    const onRemove = () => store.set(store.get() - 1);
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
  import Observable from "@muzikanto/observable/lib/Observable";

  const store = new Observable({one: 1, two: 2});

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
      const onAddOne = () => {
          const oldState = store.get();

          store.set({...oldState, one: oldState.one + 1});
      };
      const onAddTwo = () => {
            const oldState = store.get();
      
            store.set({...oldState, two: oldState.two + 1});
        };
      
      return (
          <>
            <OnePreview/>
            <TwoPreview/>
            <button onClick={onAddOne}>add-one</button>
            <button onClick={onAddTwo}>add-two</button>
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
    import useField from "@muzikanto/observable/lib/useField";

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
        import useFieldArray from "@muzikanto/observable/lib/useFieldArray";

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