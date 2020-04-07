import { Store } from './Observable';
import React from 'react';
import useStore from './useStore';

function connect<S, V extends object = S extends object ? S : {}>(
   store: Store<S>,
   selector?: (state: S) => V,
) {
   return function<P>(component: (props: P & V) => React.ReactNode) {
      return (props: P) => {
         const state = useStore(store, selector);

         return <>{component({ ...props, ...state })}</>;
      };
   };
}

export default connect;
