import * as React from 'react';
import { FormConfig } from '../typings';

// @ts-ignore
const FormContext = React.createContext<FormConfig<any>>(null);

export default FormContext;
