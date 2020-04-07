import useFieldArray from '../../src/useFieldArray';
import * as React from 'react';

function FieldArray(props: { name: string }) {
   const { value, push, pop, swap, clear } = useFieldArray<string>({
      name: props.name,
      validate: v => {
         if (false) {
            return 'my custom error';
         }
      },
   });

   return (
      <>
         {value.map((el, i) => {
            return <span key={i + 'test'}>{el}</span>;
         })}
         <button onClick={() => push((value.length + 1).toString())}>push</button>
         <button onClick={() => pop()}>pop</button>
         <button onClick={() => swap(0, 1)}>swap</button>
         <button onClick={() => clear()}>clear</button>
      </>
   );
}

export default FieldArray;
