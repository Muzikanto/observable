import React from 'react';
import useStore from './useStore';
import { Store } from './Observable';

export interface StoreConsumerProps<S, V = S> {
   children: (state: V) => React.ReactNode;
   store: Store<S>;
   selector?: (state: S) => V;
}

function StoreConsumer<S, V = S>(props: StoreConsumerProps<S, V>) {
   const state = useStore(props.store, props.selector);

   return props.children(state);
}

export default StoreConsumer;
