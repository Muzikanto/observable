import createStore from './createStore';
import React from 'react';

function useRefStore<T>(state: T) {
   const { current } = React.useRef(createStore(state));

   return current;
}

export default useRefStore;
