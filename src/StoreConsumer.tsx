import React from 'react';
import useStore from './useStore';
import { Store } from './Observable';

export interface StoreConsumerProps<S, V = S> {
   store: Store<S>;
   selector?: (state: S) => V;
   children: (state: V) => React.ReactNode;
}

function StoreConsumer<S, V = S>(props: StoreConsumerProps<S, V>) {
   const state = useStore<S, V>(props.store, props.selector);

   return <>{props.children(state)}</>;
}

export default StoreConsumer;
