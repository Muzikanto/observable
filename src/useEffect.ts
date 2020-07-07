import Effect from './Effect';
import React from 'react';

function useEffect<Req, Res, Err = Error>(effect: Effect<Req, Res, Err>) {
   const [data, setData] = React.useState<Res | null>(null);
   const [loading, setLoading] = React.useState(false);
   const [error, setError] = React.useState<Err | null>(null);

   React.useEffect(() => {
      const unw1 = effect.done.watch(setData);
      const unw2 = effect.loading.watch(setLoading);
      const unw3 = effect.fail.watch(setError);

      return () => {
         unw1();
         unw2();
         unw3();
      };
   }, [effect]);

   return {
      data,
      loading,
      error,
      refetch: effect,
   };
}

export default useEffect;
