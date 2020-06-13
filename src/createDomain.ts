import baseCreateStore from './createStore';
import baseCreateEvent from './createEvent';
import baseCreateEffect from './createEffect';
import { IEvent } from './Event';
import { Store } from './Observable';
import { IEffect } from './Effect';

export interface Domain {
   createEvent: typeof baseCreateEvent;
   createEffect: typeof baseCreateEffect;
   createStore: typeof baseCreateStore;
   onCreateEvent: (watcher: (event: IEvent<any>) => void) => void;
   onCreateStore: (watcher: (store: Store<any>) => void) => void;
   onCreateEffect: (watcher: (effect: IEffect<any, any, any>) => void) => void;
}

function createDomain(): Domain {
   let onCreateEventWatcher: ((event: IEvent<any>) => void) | undefined = undefined;
   let onCreateStoreWatcher: ((store: Store<any>) => void) | undefined = undefined;
   let onCreateEffectWatcher: ((effect: IEffect<any, any, any>) => void) | undefined = undefined;

   const createEvent = <P = void>() => {
      const event = baseCreateEvent<P>();

      if (onCreateEventWatcher) {
         onCreateEventWatcher(event);
      }

      return event;
   };
   const createStore: typeof baseCreateStore = (state) => {
      const store = baseCreateStore(state);

      if (onCreateStoreWatcher) {
         onCreateStoreWatcher(store);
      }

      return store;
   };
   const createEffect: typeof baseCreateEffect = (request, options) => {
      const effect = baseCreateEffect(request, options);

      if (onCreateEffectWatcher) {
         onCreateEffectWatcher(effect);
      }

      return effect;
   };

   const onCreateEvent = (watcher: (event: IEvent<any>) => void) => {
      onCreateEventWatcher = watcher;
   };
   const onCreateStore = (watcher: (store: Store<any>) => void) => {
      onCreateStoreWatcher = watcher;
   };
   const onCreateEffect = (watcher: (effect: IEffect<any, any, any>) => void) => {
      onCreateEffectWatcher = watcher;
   };

   return {
      createEvent,
      createStore,
      createEffect,
      onCreateEvent,
      onCreateStore,
      onCreateEffect,
   };
}

export default createDomain;
