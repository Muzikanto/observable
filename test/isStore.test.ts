import isStore from '../src/isStore';
import createStore from '../src/createStore';

describe('isStore', () => {
   it('false', () => {
      for (const v of [{}, [], '', 1, true, null, undefined]) {
         expect(isStore(v)).toBe(false);
      }
   });
   it('true', () => {
      const store = createStore(1);

      expect(isStore(store)).toBe(true);
   });
});
