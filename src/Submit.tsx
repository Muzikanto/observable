import React, {useContext} from 'react';
import FormContext from "./FormContext";
import useStore from "./useStore";
import {FormConfig} from "./createForm";

export interface SubmitProps<P extends object> {
    component: (props: { onClick: (e: React.MouseEvent<any>) => void; disabled: boolean; }) => JSX.Element;
}

function Submit<P extends object>(props: SubmitProps<P>) {
    const ctx = useContext(FormContext) as FormConfig<any>;

    const isValid = useStore(ctx.isValid);
    const Component = props.component as React.ComponentType<any>;

    return (
        <Component
            type="submit"
            onClick={() => {
                ctx.submit();
            }}
            disabled={!isValid}
        />
    )
}

export default Submit;
