import { Listener } from './Observable';

export type IEvent<P = void> = {
   (payload: P): void;
   watch: (watcher: Listener<P>) => () => void;
};

class Event<P = void> {
   protected listeners: Array<Listener<P>> = [];

   public call: IEvent<P>;

   constructor() {
      // @ts-ignore
      this.call = (payload: P) => {
         this.listeners.forEach(l => l(payload));
      };
      this.call.watch = this.watch;
   }

   public watch = (watcher: Listener<P>) => {
      this.listeners.push(watcher);

      return () => {
         this.listeners = this.listeners.filter(l => l !== watcher);
      };
   };
}

export default Event;
