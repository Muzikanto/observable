import * as Yup from 'yup';
import createForm from '../../src/createForm';

interface FormState {
   text: string;
   field: string;
   deep: {
      one: string;
      two: string;
   };
   arr: string[];
}

const validationSchema = Yup.object().shape({
   text: Yup.string()
      .required()
      .max(5),
   field: Yup.string()
      .required()
      .max(3),
});

const form = createForm<FormState>({
   validateOnCreate: false,
   initialState: {
      text: '123',
      field: '',
      deep: { one: '1', two: '' },
      arr: ['1', '2', '3'],
   },
   validationSchema,
});

export default form;
