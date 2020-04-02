import {IEvent} from "./Event";

function forward<P>(from: IEvent<P>, to: IEvent<P>) {
    return from.watch(to);
}

export default forward;
