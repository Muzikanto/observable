import createEvent from '../src/createEvent';
import isEvent from '../src/isEvent';
import createStore from '../src/createStore';

describe('isEvent', () => {
   it('false', () => {
      for (const v of [{}, [], '1', 1, true, null, undefined, createStore(1)]) {
         expect(isEvent(v)).toBe(false);
      }
   });
   it('true', () => {
      const event = createEvent();

      expect(isEvent(event)).toBe(true);
   });
});
