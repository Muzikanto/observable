import createStore from '../src/createStore';
import combineAsync from '../src/combineAsync';

describe('combineAsync', () => {
   it('base', () => {
      const one = createStore(1);
      const two = createStore(2);
      const three = createStore(3);

      const combinedStore = combineAsync({ one, two });

      expect(combinedStore.get()).toEqual({
         one: 1,
         two: 2,
      });

      combinedStore.injectStore('three', three);

      expect(combinedStore.get()).toEqual({
         one: 1,
         two: 2,
         three: 3,
      });
   });

   it('concat', () => {
      const one = createStore(1);
      const two = createStore(2);
      const three = createStore(3);

      const combinedStore = combineAsync<any>(
         { one, two },
         ({ one, two, three }) => one + two + (three || 0),
      );

      expect(combinedStore.get()).toEqual(3);

      combinedStore.injectStore('three', three);

      expect(combinedStore.get()).toEqual(6);
   });
});
