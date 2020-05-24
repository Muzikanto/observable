import createStore from './createStore';
import { Store } from './Observable';

export type CombineStore<S> = Store<S> & { _listeners: { [key: string]: () => void } };

function combine<Map extends { [key: string]: any }, S = Map>(
   map: { [k in keyof Map]: Store<Map[k]> },
   func?: (map: Map) => S,
): CombineStore<S> {
   const state = Object.keys(map).reduce(
      (acc, key) => ({ ...acc, [key]: map[key].get() }),
      {} as Map,
   ) as Map;
   const listeners: { [key: string]: () => void } = {};

   const store = createStore(func ? func(state) : state) as CombineStore<S>;
   store._listeners = listeners;

   const changer = (key: keyof Map, value: Map[typeof key]) => {
      const newState = Object.keys(map).reduce((acc, key) => ({ ...acc, [key]: map[key].get() }), {
         [key]: value,
      } as Map) as Map;

      store.set((func ? func(newState) : newState) as S);
   };

   for (const key in map) {
      const unWatch = map[key].watch(nextState => {
         changer(key, nextState);
      });

      listeners[key] = unWatch;
   }

   return store;
}

export default combine;
