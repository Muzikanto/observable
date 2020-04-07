import * as React from 'react';
import useStore from '../src/useStore';
import createStore from '../src/createStore';
import createEvent from '../src/createEvent';

const store = createStore(1);
const change = createEvent<number>();

store.on(change, (_, payload) => payload);

function Base() {
   const value = useStore(store);

   return <input type='number' value={value} onChange={e => change(+e.target.value)} />;
}

export default Base;
