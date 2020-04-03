import * as helpers from './utils';
import {Schema} from 'yup';
import Observable, {Store} from "./Observable";

export type FormErrors<State extends object> = {
    [k in keyof State]?: State[k] extends object ? FormErrors<State[k]> : string | undefined;
};

export type FormTouched<State extends object> = {
    [k in keyof State]?: State[k] extends object ? FormTouched<State[k]> : boolean;
};

export interface FormConfig<State extends object> {
    values: Store<State>;
    errors: Store<FormErrors<State>>;
    touched: Store<FormTouched<State>>;
    isValid: Store<boolean>;

    setValue: (params: { key: string; value: any; validate?: boolean; }) => void;
    setError: (params: { key: string; value: string | undefined }) => void;
    setTouched: (params: { key: string; value: boolean }) => void;

    submit: () => void;
    reset: () => void;
    validate: () => void;
    validateAt: (key: string) => void;
}

export interface FormParams<State extends object> {
    initialState: State;
    initialErrors?: FormErrors<State>;
    initialTouched?: FormTouched<State>;
    validationSchema?: Schema<Partial<State>>;

    validateOnCreate?: boolean;

    onSubmit?: (state: State) => void;
    onChange?: (state: State) => void;
}

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>;

function createForm<State extends object>(props: FormParams<State>): FormConfig<State> {
    const values = new Observable<State>(props.initialState);
    const errors = new Observable<FormErrors<State>>(props.initialErrors || {});
    const touched = new Observable<FormTouched<State>>(props.initialTouched || {});
    const isValid = new Observable<boolean>(true);

    const setValid = (payload: boolean) => {
        isValid.set(payload);
    };
    const setValue = (payload: { key: string; value: any; validate?: boolean }) => {
        const currentValue = helpers.getDeepValue<any>(values.get(), payload.key);
        const currentTouched = helpers.getDeepValue<boolean>(touched.get(), payload.key);

        if (!currentTouched) {
            setTouched({key: payload.key, value: true});
        }

        if (currentValue === payload.value) {
            return;
        }

        if (payload.validate) {
            validateAt(payload.key);
        }

        const nextIsValid = !helpers.checkExistsError(errors.get());

        if (nextIsValid !== isValid.get()) {
            setValid(nextIsValid);
        }

        values.set({...helpers.setDeepValue(values.get(), payload.key, payload.value)});

        if (props.onChange) {
            props.onChange(values.get());
        }
    };
    const setError = (payload: { key: string; value: string | undefined }) => {
        const currentError = helpers.getDeepValue<string | undefined>(errors.get(), payload.key);

        if (currentError === payload.value) {
            return;
        }

        errors.set({...helpers.setDeepValue(errors.get(), payload.key, payload.value || '')});
    };
    const setTouched = (payload: { key: string; value: boolean }) => {
        const currentTouched = helpers.getDeepValue<boolean>(touched.get(), payload.key);

        if (currentTouched === payload.value) {
            return;
        }

        return touched.set({...helpers.setDeepValue(touched.get(), payload.key, payload.value)});
    };
    const reset = () => {
        values.reset();
        errors.reset();
        touched.reset();
        isValid.reset();

        if (props.validateOnCreate) {
            validate();
        }
    };

    const validateAt = (key: string) => {
        if (props.validationSchema) {
            const currentError = helpers.getDeepValue<string | undefined>(errors.get(), key);

            try {
                props.validationSchema.validateSyncAt(key, values.get());

                if (currentError) {
                    setError({key, value: ''});
                }
            } catch (e) {
                if (Object.keys(e).length > 0 && e.message !== currentError) {
                    const key1 = e.path.replace('[', '.').replace(']', '');

                    setError({key: key1, value: e.message});
                }
            }
        }
    };
    const validate = () => {
        if (props.validationSchema) {
            try {
                props.validationSchema.validateSync(values.get(), {
                    recursive: true,
                    abortEarly: false,
                });
            } catch (e) {
                for (const err of e.inner) {
                    const key = err.path.replace('[', '.').replace(']', '');

                    setError({key, value: err.message});
                    setTouched({key, value: true})
                }
            }
        }
    };

    const submit = () => {
        validate();

        if (props.onSubmit && isValid.get()) {
            props.onSubmit(values.get());
        }
    };

    if (props.validateOnCreate) {
        validate();
    }

    return {
        values,
        errors,
        touched,
        isValid,

        setValue,
        setError,
        setTouched,

        submit,
        reset,
        validate,
        validateAt,
    };
}

export default createForm;
