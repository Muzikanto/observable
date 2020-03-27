import React, {useContext} from 'react';
import Ctx from "../main/ctx";
import {FormConfig} from "../typings";
import useStore from "../../Observable/hooks/useStore";

export interface SubmitProps<P extends object> {
    component: (props: { onClick: (e: React.MouseEvent<any>) => void; disabled: boolean; }) => JSX.Element;
}

function Submit<P extends object>(props: SubmitProps<P>) {
    const ctx = useContext(Ctx) as FormConfig<any>;

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
