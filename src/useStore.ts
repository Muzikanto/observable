import React from 'react';
import {Store} from './Observable';

function useStore<T>(observable: Store<T>): T {
    const [val, setVal] = React.useState(observable.get());

    React.useEffect(() => {
        setVal(observable.get());

        return observable.subscribe(setVal);
    }, [observable]);

    return val;
}

export default useStore;
