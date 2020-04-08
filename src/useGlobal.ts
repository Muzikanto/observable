import useStore from './useStore';
import GlobalStoreCtx from './global-store-ctx';
import React from 'react';
import { Store } from './Observable';

function useGlobal<State, Part>(selector: (globalState: State) => Part) {
   const globalStore = React.useContext<Store<State>>(GlobalStoreCtx);

   const state = useStore<State, Part>(globalStore, selector);

   return state;
}

export default useGlobal;
