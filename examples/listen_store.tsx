import React from 'react';
import createStore from '../src/createStore';
import useStore from '../src/useStore';
import StoreConsumer from '../src/StoreConsumer';
import connect from '../src/connect';

const store = createStore({ value: 1 });

function Component() {
   const One = () => {
      const state = useStore(store);

      return <span>{state.value}</span>;
   };
   const Two = () => {
      const value = useStore(store, state => state.value);

      return <span>{value}</span>;
   };
   const Three = () => {
      return <StoreConsumer store={store}>{state => <span>{state.value}</span>}</StoreConsumer>;
   };
   const Four = connect(store)(props => {
      return <span>{props.value}</span>;
   });
   const Five = connect(
      store,
      s => ({ propValue: s.value }),
   )(props => {
      return <span>{props.propValue}</span>;
   });

   return (
      <>
         <One />
         <Two />
         <Three />
         <Four />
         <Five />
      </>
   );
}

export default Component;
