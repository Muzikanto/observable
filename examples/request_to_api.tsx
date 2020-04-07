import createStore from '../src/createStore';
import * as React from 'react';
import useStore from '../src/useStore';
import createEffect from '../src/createEffect';

const done = createStore<number | null>(null);
const fail = createStore<string | null>(null);
const loading = createStore<boolean>(false);

const request = createEffect(async (params: { isSuccess: boolean }) => {
   try {
      const response = 200; // TODO request to api

      // example error in request
      if (!params.isSuccess) {
         throw Error();
      }

      return response;
   } catch (e) {
      // or reject error
      throw Error('My error message');
   }
});

done.on(request.done, (_, payload) => payload);
fail.on(request.fail, (_, { message }) => message);
loading.on(request.loading, (_, payload) => payload);

function Base() {
   const doneState = useStore(done);
   const failState = useStore(fail);
   const loadingState = useStore(loading);

   if (loadingState) {
      return <span>spinner</span>;
   }

   return (
      <>
         <span>response: {doneState}</span>
         <span>error: {failState}</span>
         <button
            onClick={() => {
               request({ isSuccess: true }).then(response => {
                  console.log(response);
               });
            }}
         >
            success request
         </button>
         <button
            onClick={() => {
               request({ isSuccess: false }).catch(err => {
                  console.log(err);
               });
            }}
         >
            failure request
         </button>
      </>
   );
}

export default Base;
