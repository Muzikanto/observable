import React from 'react';
import GlobalStoreCtx from './global-store-ctx';
import { Store } from './Observable';

export interface GlobalStoreProviderProps<State> {
   children: React.ReactNode;
   store: Store<State>;
}

function GlobalStoreProvider<State>(props: GlobalStoreProviderProps<State>) {
   return <GlobalStoreCtx.Provider value={props.store}>{props.children}</GlobalStoreCtx.Provider>;
}

export default GlobalStoreProvider;
