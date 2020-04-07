import createStore from '../src/createStore';
import createEvent from '../src/createEvent';
import * as React from 'react';
import useStore from '../src/useStore';

const store = createStore({ deep: { value: 1 }, value2: 2 });
const changeValue = createEvent<number>();

store.on(changeValue, (state, payload) => ({ ...state, deep: { value: payload } }));

function Base() {
   const value = useStore(store, state => state.deep.value);

   return <input type='number' value={value} onChange={e => changeValue(+e.target.value)} />;
}

export default Base;
