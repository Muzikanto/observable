import deepCopy from "../../helpers/deepCopy";

type Listener<T> = (val: T) => void;

class Observable<T> {
    protected listeners: Array<{ event: Listener<T>, selector?: (state: T) => any }> = [];
    protected initialValue: T;
    protected value: T;

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
        }
    }

    public subscribe(listener: Listener<any>, selector?: (state: T) => any) {
        this.listeners.push({event: listener, selector});

        return () => this.unsubscribe(listener);
    }

    public unsubscribe(listener: Listener<T>) {
        this.listeners = this.listeners.filter(l => l.event !== listener);
    }

    public reset() {
        this.set(deepCopy(this.initialValue));
    }
}

export default Observable;
