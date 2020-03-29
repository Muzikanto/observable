import {Listener} from "./Observable";

export type IEvent<P> = (payload: P) => void;

class Event<P> {
    protected listeners: Array<Listener<P>> = [];

    constructor() {
        this.call.prototype = this;
    }

    public call = (payload: P) => {
        this.listeners.forEach(l => l(payload));
    }
}

export default Event;
