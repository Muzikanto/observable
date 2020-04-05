import createStore from './createStore';
import { Store } from './Observable';

function combine<Map extends { [key: string]: any }, S = Map>(
   map: { [k in keyof Map]: Store<Map[k]> },
   func?: (map: Map) => S,
): Store<S> {
   const state = Object.keys(map).reduce(
      (acc, key) => ({ ...acc, [key]: map[key].get() }),
      {} as Map,
   ) as Map;

   const store = createStore(func ? func(state) : state);

   const changer = (key: keyof Map, value: Map[typeof key]) => {
      store.set({
         ...store.get(),
         [key]: value,
      });
   };

   for (const key in map) {
      map[key].watch(nextState => {
         changer(key, nextState);
      });
   }

   return store as Store<S>;
}

export default combine;
