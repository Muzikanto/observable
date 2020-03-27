import * as React from 'react';
import {FormConfig} from "./createForm";

// @ts-ignore
const FormContext = React.createContext<FormConfig<any>>(null);

export default FormContext;
