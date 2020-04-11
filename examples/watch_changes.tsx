import createStore from '../src/createStore';
import createEvent from '../src/createEvent';
import * as React from 'react';
import useStore from '../src/useStore';

const store = createStore(1);
const change = createEvent<number>();

store.on(change, (_, payload) => payload);

// watch store changes
const unWatchStore1 = store.watch((state, prev) =>
   console.log('currentState1: ' + state, 'prevState1: ' + prev),
);
const unWatchStore2 = store.watch((state, prev) =>
   console.log('currentState2: ' + state, 'prevState2: ' + prev),
);

// watch event payloads
const unWatchEvent1 = change.watch(payload => console.log('payload1: ' + payload));
const unWatchEvent2 = change.watch(payload => console.log('payload2: ' + payload));

function Base() {
   const value = useStore(store);

   const disableWatchers = () => {
      unWatchStore1();
      unWatchStore2();
      unWatchEvent1();
      unWatchEvent2();
   };

   return (
      <>
         <input type='number' value={value} onChange={e => change(+e.target.value)} />
         <button onClick={disableWatchers}>disable watchers</button>
      </>
   );
}

export default Base;
