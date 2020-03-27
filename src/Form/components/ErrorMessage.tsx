import React, {useContext} from 'react';
import Ctx from "../main/ctx";
import {FormConfig} from "../typings";
import {getDeepValue} from "../helpers";
import useSelector from "../../Observable/hooks/useSelector";

export interface ErrorMessageProps<P extends { children: string | undefined }> {
    name: string;
    component: React.ComponentType<P>;
}

function ErrorMessage<P extends { children: string | undefined }>(props: ErrorMessageProps<P>) {
    const ctx = useContext(Ctx) as FormConfig<any>;

    const error = useSelector(ctx.errors, (state) => {
        return getDeepValue<string | undefined>(state, props.name)
    });
    const Component = (props.component || (({children}) => children)) as React.ComponentType<any>;

    return <Component children={error}/>;
}

export default ErrorMessage;
