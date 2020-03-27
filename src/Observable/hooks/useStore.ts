import React from 'react';
import Observable from '../main/Observable';

function useStore<T>(observable: Observable<T>): T {
    const [val, setVal] = React.useState(observable.get());

    React.useEffect(() => {
        setVal(observable.get());

        return observable.subscribe(setVal);
    }, [observable]);

    return val;
}

export default useStore;
