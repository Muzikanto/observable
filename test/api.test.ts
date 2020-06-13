import createApi from '../src/createApi';
import createStore from '../src/createStore';

function getApi() {
   const store = createStore(1);

   return createApi(store, {
      add: (s, p: number) => s + p,
      change: (_, p: number) => p,
   });
}

describe('api', () => {
   let api: ReturnType<typeof getApi>;

   beforeEach(() => {
      api = getApi();
   });

   it('add value', () => {
      api.add(4);

      expect(api.store.get()).toBe(5);
   });

   it('change value', () => {
      api.change(-3);

      expect(api.store.get()).toBe(-3);
   });
});
