import React from 'react';

import createGlobalStore from '../../src/global-store';
import makeStore, { GlobalState } from './store';
import GlobalStoreProvider from '../../src/GlobalStoreProvider';

function App() {
   const initialState: Partial<GlobalState> = { userData: 'Maxim' };
   const store = createGlobalStore<GlobalState>(makeStore, initialState);

   return <GlobalStoreProvider store={store}>// TODO</GlobalStoreProvider>;
}

export default App;
