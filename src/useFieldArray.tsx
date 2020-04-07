import useField, { FieldValidator } from './useField';

export interface FieldArrayProps<Value> {
   name: string;
   validate?: FieldValidator<Value[]>;
}

function useFieldArray<Value>(props: FieldArrayProps<Value>) {
   const field = useField<Value[]>({
      name: props.name,
      validate: props.validate,
   });

   if (!Array.isArray(field.value)) {
      console.error(props.name + ' is not array');
   }

   const push = (...args: Value[]) => {
      field.setFieldValue([...field.value, ...args]);
   };
   const removeAt = (index: number) => {
      const newArr = [...field.value];

      newArr.splice(index, 1);

      field.setFieldValue(newArr);
   };
   const insertAt = (index: number, ...args: Value[]) => {
      const newArr = [...field.value];

      newArr.splice(index, 0, ...args);

      field.setFieldValue(newArr);
   };
   const pop = () => {
      const newArr = [...field.value];

      newArr.pop();

      field.setFieldValue(newArr);
   };
   const swap = (index1: number, index2: number) => {
      const newArr = [...field.value];

      [newArr[index1], newArr[index2]] = [newArr[index2], newArr[index1]];

      field.setFieldValue(newArr);
   };
   const clear = () => {
      field.setFieldValue([]);
   };

   return {
      ...field,

      push,
      removeAt,
      insertAt,
      pop,
      swap,
      clear,
   };
}

export default useFieldArray;
