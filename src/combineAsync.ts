import { Store } from './Observable';
import combine, { CombineStore } from './combine';

export type CombineAsyncStore<S> = CombineStore<S> & {
   _listeners: { [key: string]: () => void };
   injectStore: (key: string, store: Store<any>) => void;
};

function combineAsync<Map extends { [key: string]: any }, S = Map>(
   map: { [k in keyof Map]: Store<Map[k]> },
   func?: (map: Map) => S,
): CombineAsyncStore<S> {
   const combinedStore = (combine(map, func) as unknown) as CombineAsyncStore<S>;

   const listeners = combinedStore._listeners;
   const storesMap: { [key: string]: Store<any> } = map;

   combinedStore.injectStore = function(key: string, partStore: Store<any>, force?: boolean) {
      if (storesMap[key] && !force) {
         return;
      }

      storesMap[key] = partStore;

      if (key in combinedStore._listeners) {
         listeners[key]();
      }

      const unWatch = partStore.watch(nextState => {
         combinedStore._changer(key, nextState);
      });

      listeners[key] = unWatch;

      combinedStore._changer(key, partStore.get());
   };

   return combinedStore;
}

export default combineAsync;
