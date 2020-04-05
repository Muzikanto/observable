import { IEvent } from './Event';

function forward<P>(from: IEvent<P>, to: IEvent<P> | Array<IEvent<P>>) {
   if (Array.isArray(to)) {
      return to.map(l => from.watch(l));
   } else {
      return from.watch(to);
   }
}

export default forward;
