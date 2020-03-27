import {Schema} from 'yup';
import Observable from "../../Observable/main/Observable";

export type FormErrors<State extends object> = {
    [k in keyof State]?: State[k] extends object ? FormErrors<State[k]> : string | undefined;
};

export type FormTouched<State extends object> = {
    [k in keyof State]?: State[k] extends object ? FormTouched<State[k]> : boolean;
};

export interface FormConfig<State extends object> {
    values: Observable<State>;
    errors: Observable<FormErrors<State>>;
    touched: Observable<FormTouched<State>>;
    isValid: Observable<boolean>;

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
