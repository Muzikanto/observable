import { IEvent } from './Event';
import createEvent from './createEvent';

export type Timer<R> = IEvent<R> & {
   disable: () => void;
};

function timer<R>(event: IEvent<R>, timeout: number, interval?: number): Timer<R> {
   const ev = createEvent<R>();

   let timeoutId: any;
   let intervalId: any;

   const disable = () => {
      if (timeoutId) {
         clearTimeout(timeoutId);
      }
      if (intervalId) {
         clearInterval(intervalId);
      }
   };

   ev.watch((val) => {
      if (typeof interval === 'undefined') {
         timeoutId = setTimeout(() => event(val), timeout);
      } else {
         timeoutId = setTimeout(() => {
            intervalId = setInterval(() => event(val), interval);
         }, timeout);
      }
   });

   Object.assign(ev, { disable });

   return (ev as unknown) as Timer<R>;
}

export default timer;
