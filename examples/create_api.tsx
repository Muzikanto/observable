import * as React from 'react';
import useStore from '../src/useStore';
import createApi from '../src/createApi';

const api = createApi(1, {
   increment: (state, payload: number) => state + payload,
   change: (state, payload: string) => +payload,
});

function Base() {
   const value = useStore(api.store);

   return (
      <>
         <input type='number' value={value} onChange={e => api.change(e.target.value)} />
         <button onClick={() => api.increment(2)}>+2</button>
      </>
   );
}

export default Base;
