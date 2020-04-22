import { deepCopy } from '../src/utils';

describe('utils', () => {
   it('deepCopy', () => {
      const obj1 = { test: { one: 1 } };
      const obj2 = deepCopy(obj1);

      obj2.test.one = 2;

      expect(obj1.test.one).toBe(1);
   });
});
