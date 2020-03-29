import {Listener} from "./Observable";

export type IEvent<P> = (payload: P) => void;

class Event<P> {
    protected listeners: Array<Listener<P>> = [];

    constructor() {
        this.call.prototype = {
            listeners: this.listeners,
        };
    }

    public call(payload: P) {
        this.listeners.forEach(l => l(payload));
    }
}

export default Event;
