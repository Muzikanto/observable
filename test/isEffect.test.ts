import createStore from '../src/createStore';
import createEffect from '../src/createEffect';
import isEffect from '../src/isEffect';

describe('isEffect', () => {
   it('false', () => {
      for (const v of [{}, [], '1', 1, true, null, undefined, createStore(1)]) {
         expect(isEffect(v)).toBe(false);
      }
   });
   it('true', () => {
      const event = createEffect(async () => 1);

      expect(isEffect(event)).toBe(true);
   });
});
