import Form from '../../src/Form';
import form from './Form.store';
import React from 'react';
import FieldInput from './FieldInput';
import Submit from '../../src/Submit';
import ErrorMessage from '../../src/ErrorMessage';
import FieldArray from './FieldArray';

function FormComponent() {
   return (
      <Form form={form} formId='form-id' formProps={{}}>
         <FieldInput name='text' />
         <FieldInput name='field' />
         <FieldInput name='deep.one' />

         <FieldArray name='arr' />

         <button onClick={() => form.reset()}>RESET</button>
         <button onClick={() => form.validate()}>VALIDATE</button>

         <Submit
            component={({ onClick, disabled }) => (
               <button onClick={onClick} disabled={disabled}>
                  Submit
               </button>
            )}
         />
         <ErrorMessage name='field' component={props => <span {...props} />} />
      </Form>
   );
}

export default FormComponent;
