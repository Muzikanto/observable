import createEvent from "../src/createEvent";

describe('Event', () => {
    it('watch', () => {
        let v = 1;

        const event = createEvent<number>();

        event.watch((payload) => {
            v = v + payload + 1;
        });

        event(2);

        expect(v).toBe(4);
    });

    it('unWatch', () => {
        let v = 1;

        const event = createEvent<number>();

        const unWatch = event.watch((payload) => {
            v = v + payload + 1;
        });

        unWatch();

        event(2);

        expect(v).toBe(1);
    });
});
