import useStore from '../src/useStore';
import React from 'react';
import createStore from '../src/createStore';
import combine from '../src/combine';

const hello = createStore('Hello');
const name = createStore('World');

const combinedStore = combine({ hello, name }, ({ hello, name }) => {
   return hello + ' ' + name;
});
// combinedStringStore.get(); "Hello World"

function Component() {
   const ChangeNameComponent = () => {
      const nameState = useStore(name); //

      return (
         <input
            value={nameState}
            onChange={e => {
               // combinedStore watch child stores changed
               name.set(e.target.value);
            }}
         />
      );
   };
   const OutputComponent = () => {
      const str = useStore(combinedStore);

      return <span>{str}</span>;
   };

   return (
      <>
         <ChangeNameComponent />
         <OutputComponent />
      </>
   );
}

export default Component;
