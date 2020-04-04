import createStore from "../src/createStore";
import createEvent from "../src/createEvent";

describe('store', () => {
    let store = createStore<number>(1);

    beforeEach(() => {
        store = createStore(1);
    });

    it('change', () => {
        store.set(2);

        expect(store.get()).toBe(2);
    });

    it('change with event', () => {
        const event = createEvent<number>();

        store.on(event, (state, payload) => state + payload);

        event(2);

        expect(store.get()).toBe(3);
    });

    it('store watch', () => {
        let v = 2;

        store.watch(() => {
            v = v * 2;
        });

        store.set(2);
        store.set(3);

        expect(v).toBe(2);

        setTimeout(() => {
            expect(v).toBe(8);
        }, 0);
    });

    it('store subscribe', () => {
        let v = 2;

        store.subscribe((state) => {
            v = state + 1;
        }, state => {
            return state + 2;
        });

        store.set(3);

        expect(v).toBe(6)
    });

    it('reset', () => {
       store.set(3);

       store.reset();

       expect(store.get()).toBe(1);
    });

    it('unsubscribe', () => {
        let v = 2;

        const unSubscribe = store.subscribe((state) => {
            v = state + 1;
        }, state => {
            return state + 2;
        });

        unSubscribe();

        store.set(3);

        expect(v).toBe(2)
    });

    it('unWatch', () => {
        let v = 2;

        const unWatch = store.watch(() => {
            v = v * 2;
        });

        unWatch();

        store.set(2);
        store.set(3);

        expect(v).toBe(2)
    });

    it('unwatch change with event', () => {
        const event = createEvent<number>();

        const unWatch = store.on(event, (state, payload) => state + payload);

        unWatch();

        event(2);

        expect(store.get()).toBe(1);
    });
});
