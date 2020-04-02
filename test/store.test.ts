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

        expect(v).toBe(8)
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
});
