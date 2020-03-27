import * as helpers from '../helpers';
import {FormConfig, FormErrors, FormParams, FormTouched} from '../typings';
import Observable from "../../Observable/main/Observable";

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
