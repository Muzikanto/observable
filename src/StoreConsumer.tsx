import React from 'react';
import useStore from './useStore';
import { Store } from './Observable';

export interface StoreConsumerProps<S, V = S> {
   store: Store<S>;
   children: (state: V) => React.ReactNode;
}

function StoreConsumer<S, V = S>(props: StoreConsumerProps<S, V>) {
   const state = useStore<S, V>(props.store);

   return <>{props.children(state)}</>;
}

export default StoreConsumer;
