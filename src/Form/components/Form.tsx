import * as React from 'react';
import Ctx from '../main/ctx';
import {FormConfig, Omit} from '../typings';

export interface FormContextProps<State extends object> {
   form: FormConfig<State>;
   children: React.ReactNode;

   formId?: string;
   formProps?: Omit<
      React.DetailedHTMLProps<React.FormHTMLAttributes<HTMLFormElement>, HTMLFormElement>,
      'id' | 'onSubmit'
   >;
}

function Form<State extends object>(props: FormContextProps<State>) {
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
