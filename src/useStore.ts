import React from 'react';
import { Store } from './Observable';

function useStore<S, V = S>(store: Store<S>, selector?: (state: S) => V): V {
   const [val, setVal] = React.useState(selector ? selector(store.get()) : store.get());

   React.useEffect(() => {
      setVal(selector ? selector(store.get()) : store.get());

      return store.subscribe(setVal, selector);
   }, [store]);

   return val as V;
}

export default useStore;
