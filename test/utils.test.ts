import {checkExistsError, deepCopy, getDeepValue, setDeepValue} from "../src/utils";

describe('utils', () => {
    it('deepCopy', () => {
        const obj1 = {test: {one: 1}};
        const obj2 = deepCopy(obj1);

        obj2.test.one = 2;

        expect(obj1.test.one).toBe(1);
    });

    it('getDeepValue', () => {
        const obj = {test: {one: 1}};

        expect(getDeepValue(obj, 'test.one')).toBe(1);
    });

    it('setDeepValue', () => {
        const obj = {test: {one: 1}};

        setDeepValue(obj, 'test.one', 2);

        expect(obj.test.one).toBe(2);
    });

    describe('checkExistsError', () => {
        it('true', () => {
           const errors = {
               test: {
                   one: 'err',
               },
           };

           expect(checkExistsError(errors)).toBe(true);
        });

        it('false', () => {
            const errors = {
                test: {
                    one: '',
                    two: undefined,
                },
            };

            expect(checkExistsError(errors)).toBe(false);
        });
    });
});
