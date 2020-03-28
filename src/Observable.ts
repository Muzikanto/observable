import {deepCopy} from "./utils";
import {Event} from "./createEvent";

type Listener<T> = (val: T) => void;

class Observable<T> {
    protected listeners: Array<{ event: Listener<T>, selector?: (state: T) => any }> = [];
    protected initialValue: T;
    protected value: T;
    protected watchers: Array<Listener<any>> = [];

    constructor(value: T) {
        this.value = deepCopy(value);
        this.initialValue = deepCopy(value);
    }

    public get(): T {
        return this.value;
    }

    public set(val: T) {
        if (this.value !== val) {
            this.value = val;
            this.listeners.forEach(l => l.event(l.selector ? l.selector(val) : val));
            setTimeout(() => {
                this.watchers.forEach(l => l(val));
            }, 0);
        }
    }

    public subscribe(listener: Listener<any>, selector?: (state: T) => any) {
        this.listeners.push({event: listener, selector});

        return () => {
            this.listeners = this.listeners.filter(l => l.event !== listener);
        };
    }

    public reset() {
        this.set(deepCopy(this.initialValue));
    }

    public on<P>(event: Event<P>, handler: (state: T, payload: P) => T) {
        const changeFunc = (payload: P) => {
            this.set(handler(this.get(), payload));
        };

        event.listeners.push(changeFunc);

        return () => {
            event.listeners = event.listeners.filter(l => l !== changeFunc);
        };
    }

    public watch(handler: (state: T) => void) {
        this.watchers.push(handler);

        return () => {
            this.watchers = this.watchers.filter(l => l !== handler);
        };
    }
}

export default Observable;
