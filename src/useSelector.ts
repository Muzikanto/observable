import React from 'react';
import Observable from './Observable';

function useSelector<T, V>(observable: Observable<T>, selector: (state: T) => V): V {
    const [val, setVal] = React.useState(selector(observable.get()));

    React.useEffect(() => {
        setVal(selector(observable.get()));

        return observable.subscribe(setVal, selector);
    }, [observable]);

    return val;
}

export default useSelector;
