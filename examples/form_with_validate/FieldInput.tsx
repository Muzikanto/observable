import useField from '../../src/useField';
import React from 'react';

// Re-render only changed field

function FieldInput(props: { name: string }) {
   const { value, error, touched, setFieldTouched, setFieldValue } = useField<string>({
      name: props.name,
      validate: v => {
         if (false) {
            return 'my custom error';
         }
      },
   });

   const touchedAndError = Boolean(touched && error);

   return (
      <>
         <input
            value={value}
            onChange={e => setFieldValue(e.target.value)}
            onBlur={() => setFieldTouched(true)}
         />
         {touchedAndError && <span>{error}</span>}
      </>
   );
}

export default FieldInput;
