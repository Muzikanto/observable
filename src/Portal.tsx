import React from 'react';
import {Store} from "./Observable";

export interface PortalProps<C extends React.ReactNode> {
    children: C;
    store: Store<C>;
    disablePortal?: boolean;
}

function Portal<C extends React.ReactNode>(props: PortalProps<C>) {
    React.useEffect(() => {
        if (props.disablePortal) {
            if (props.store.get() !== null) {
                // @ts-ignore
                props.store.set(null);
            }

            return;
        }

        props.store.set(props.children);
    }, [props.children, props.disablePortal]);

    if (props.disablePortal) {
        return (
            <>
                {props.children}
            </>
        );
    }

    return null;
}

export default Portal;
