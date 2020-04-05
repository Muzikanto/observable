import createStore from '../src/createStore';
import combine from '../src/combine';

describe('combine', () => {
   it('base', () => {
      const num = createStore(1);
      const obj = createStore({ test: '-two' });

      const combineStore = combine({ num, obj });

      expect(combineStore.get()).toEqual({
         num: 1,
         obj: { test: '-two' },
      });
   });

   it('concat', () => {
      const num = createStore(1);
      const obj = createStore({ test: '-two' });

      const combineStore = combine({ num, obj }, ({ num, obj }) => {
         return num + obj.test;
      });

      expect(combineStore.get()).toBe('1-two');
   });

   it('change', () => {
      const num = createStore(1);
      const obj = createStore({ test: '-two' });

      num.set(2);

      const combineStore = combine({ num, obj });

      expect(combineStore.get()).toEqual({
         num: 2,
         obj: { test: '-two' },
      });
   });
});
