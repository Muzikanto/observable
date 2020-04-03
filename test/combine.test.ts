import createStore from "../src/createStore";
import combine from "../src/combine";

describe('combine', () => {
    it('base', () => {
        const num = createStore(1);
        const obj = createStore({test: '-two'});

        const combineStore = combine({
            map: {num, obj},
            func: ({num, obj}) => {
                return num + obj.test;
            },
        });

        expect(combineStore.get()).toBe('1-two');
    });
});
