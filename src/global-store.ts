import { Store } from './Observable';

export const __OBSERVABLE_GLOBAL_STORE__ = '__OBSERVABLE_GLOBAL_STORE__';

const isServer = typeof window === 'undefined';

function createGlobalStore<S = {}>(
   func: (initialState?: Partial<S>) => Store<S>,
   initialState: Partial<S> = {},
): Store<S> {
   if (isServer) {
      return func(initialState);
   }

   // @ts-ignore
   if (!window[__OBSERVABLE_GLOBAL_STORE__]) {
      // @ts-ignore
      window[__OBSERVABLE_GLOBAL_STORE__] = func(initialState);
   }

   // @ts-ignore
   return window[__OBSERVABLE_GLOBAL_STORE__];
}

export default createGlobalStore;
