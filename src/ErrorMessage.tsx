import React, { useContext } from 'react';
import FormContext from './FormContext';
import { getDeepValue } from './utils';
import useStore from './useStore';
import { FormConfig } from './createForm';

export interface ErrorMessageProps<P extends { children: string | undefined }> {
   name: string;
   component: React.ComponentType<P>;
}

function ErrorMessage<P extends { children: string | undefined }>(props: ErrorMessageProps<P>) {
   const ctx = useContext(FormContext) as FormConfig<any>;

   const error = useStore(ctx.errors, state => {
      return getDeepValue<string | undefined>(state, props.name);
   });
   const Component = (props.component || (({ children }) => children)) as React.ComponentType<any>;

   return <Component children={error} />;
}

export default ErrorMessage;
