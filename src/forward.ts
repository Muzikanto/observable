import {IEvent} from "./Event";

function forward<P>(from: IEvent<P>, to: IEvent<P>): () => void {
    return from.watch(to);
}

export default forward;
