import { deepCopy } from './utils';
import { IEvent } from './Event';

export type Listener<T> = (val: T) => void;
export type Watcher<T> = (val: T, prev: T) => void;
export type Store<T> = Observable<T>;

class Observable<T> {
   protected listeners: Array<{ event: Listener<T>; selector?: (state: T) => any }> = [];
   protected initialValue: T;
   protected value: T;
   protected watchers: Array<Watcher<T>> = [];

   constructor(value: T) {
      this.value = deepCopy(value);
      this.initialValue = deepCopy(value);
   }

   public get(): T {
      return this.value;
   }

   public set(val: T) {
      if (this.value !== val) {
         const prev = this.value;
         this.value = val;

         this.listeners.forEach((l) => l.event(l.selector ? l.selector(val) : val));

         setTimeout(() => {
            this.watchers.forEach((l) => l(val, prev));
         }, 0);
      }
   }

   public subscribe(listener: Listener<any>, selector?: (state: T) => any) {
      this.listeners.push({ event: listener, selector });

      return () => {
         this.listeners = this.listeners.filter((l) => l.event !== listener);
      };
   }

   public reset() {
      this.set(deepCopy(this.initialValue));
   }

   public on<P>(event: IEvent<P>, handler: (state: T, payload: P) => T) {
      const changeFunc = (payload: P) => {
         this.set(handler(this.get(), payload));
      };

      return event.watch(changeFunc);
   }

   public watch(handler: (state: T, prev: T) => void) {
      this.watchers.push(handler);

      return () => {
         this.watchers = this.watchers.filter((l) => l !== handler);
      };
   }
}

export default Observable;
