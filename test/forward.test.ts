import createEvent from "../src/createEvent";
import forward from "../src/forward";

describe('forward', () => {
    it('base', () => {
        let v = 1;

        const one = createEvent<number>();
        const two = createEvent<number>();

        forward(one, two);

        two.watch((payload) => {
            v = v + payload + 1;
        });

        one(2);

        expect(v).toBe(4);
    });
});
