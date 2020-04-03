import * as helpers from './utils';
import {Schema} from 'yup';
import {Store} from "./Observable";
import createStore from "./createStore";
import createEvent from "./createEvent";
import {IEvent} from "./Event";

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

    setValue: IEvent<{ key: string; value: any; validate?: boolean; }>;
    setError: IEvent<{ key: string; value: string | undefined }>;
    setTouched: IEvent<{ key: string; value: boolean }>;

    submit: IEvent<void>;
    reset: IEvent<void>;
    validate: IEvent<void>;
    validateAt: (key: string) => void;
}

export interface FormParams<State extends object> {
    initialState: State;
    initialErrors?: FormErrors<State>;
    initialTouched?: FormTouched<State>;
    validationSchema?: Schema<Partial<State>>;

    validateOnCreate?: boolean;

    onSubmit?: (state: State) => void;
}

function createForm<State extends object>(props: FormParams<State>): FormConfig<State> {
    const values = createStore<State>(props.initialState);
    const errors = createStore<FormErrors<State>>(props.initialErrors || {});
    const touched = createStore<FormTouched<State>>(props.initialTouched || {});
    const isValid = createStore<boolean>(true);

    const setValue = createEvent<{ key: string; value: any; validate?: boolean }>();
    const setError = createEvent<{ key: string; value: string | undefined }>();
    const setTouched = createEvent<{ key: string; value: boolean }>();

    const setValid = (payload: boolean) => {
        isValid.set(payload);
    };

    values.on(setValue, (state, payload) => {
        const currentValue = helpers.getDeepValue<any>(values.get(), payload.key);
        const currentTouched = helpers.getDeepValue<boolean>(touched.get(), payload.key);

        if (!currentTouched) {
            setTouched({key: payload.key, value: true});
        }

        if (currentValue === payload.value) {
            return state;
        }

        if (payload.validate) {
            validateAt(payload.key);
        }

        const nextIsValid = !helpers.checkExistsError(errors.get());

        if (nextIsValid !== isValid.get()) {
            setValid(nextIsValid);
        }

        return {...helpers.setDeepValue(values.get(), payload.key, payload.value)};
    });
    errors.on(setError, (state, payload) => {
        const currentError = helpers.getDeepValue<string | undefined>(errors.get(), payload.key);

        if (currentError === payload.value) {
            return state;
        }

        return {...helpers.setDeepValue(errors.get(), payload.key, payload.value || '')};
    });
    touched.on(setTouched, ((state, payload) => {
        const currentTouched = helpers.getDeepValue<boolean>(touched.get(), payload.key);

        if (currentTouched === payload.value) {
            return state;
        }

        return {...helpers.setDeepValue(touched.get(), payload.key, payload.value)};
    }));

    const validate = createEvent();
    const reset = createEvent();
    const submit = createEvent();

    reset.watch(() => {
        values.reset();
        errors.reset();
        touched.reset();
        isValid.reset();

        if (props.validateOnCreate) {
            validate();
        }
    });
    submit.watch(() => {
        validate();

        if (props.onSubmit && isValid.get()) {
            props.onSubmit(values.get());
        }
    });
    validate.watch(() => {
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
    });

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
