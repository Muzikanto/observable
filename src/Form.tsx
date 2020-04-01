import * as React from 'react';
import Ctx from './FormContext';
import {FormConfig} from "./createForm";

export interface FormProps<State extends object> {
   form: FormConfig<State>;
   children: React.ReactNode;

   formId?: string;
   formProps?: Omit<
      React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>,
      'id' | 'onSubmit'
   >;
}

function Form<State extends object>(props: FormProps<State>) {
   return (
      <Ctx.Provider value={props.form}>
         <form
            id={props.formId}
            onSubmit={e => {
               e.preventDefault();
               e.stopPropagation();
               props.form.submit();
            }}
            {...props.formProps}
         >
            {props.children}
         </form>
      </Ctx.Provider>
   );
}

export default Form;
