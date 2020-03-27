import {useContext} from 'react';
import FormContext from "./FormContext";
import * as helpers from './utils';
import useSelector from "./useSelector";
import {FormConfig} from "./createForm";

export type FieldValidator<Value> = (value: Value) => string | null | void;

export interface FieldProps<Value> {
    name: string;
    validate?: FieldValidator<Value>;
}

function useField<Value>(props: FieldProps<Value>) {
    const ctx = useContext(FormContext) as FormConfig<any>;

    const value = useSelector(ctx.values, (state) => {
        return helpers.getDeepValue<Value>(state, props.name)
    });
    const error = useSelector(ctx.errors, (state) => {
        return helpers.getDeepValue<string | undefined>(state, props.name);
    });
    const touched = useSelector(ctx.touched, (state) => {
        return helpers.getDeepValue<boolean>(state, props.name)
    });

    const setFieldValue = (v: Value) => {
        ctx.setValue({key: props.name, value: v, validate: false});

        if (props.validate) {
            const nextErr = props.validate(v);

            if (nextErr) {
                if (error !== nextErr) {
                    ctx.setError({key: props.name, value: nextErr});

                    return;
                }
            }
        }

        ctx.validateAt(props.name);
    };
    const setFieldError = (v: string | undefined) => {
        ctx.setError({key: props.name, value: v});
    };
    const setFieldTouched = (v: boolean) => {
        ctx.setTouched({key: props.name, value: v});
    };

    return {
        value,
        error,
        touched,

        setFieldValue,
        setFieldError,
        setFieldTouched,
    };
}

export default useField;
