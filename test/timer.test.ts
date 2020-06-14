import createStore from '../src/createStore';
import timer from '../src/timer';
import { wait } from './utils';
import createEvent from '../src/createEvent';

describe('timer', () => {
   it('timeout', async () => {
      const store = createStore(1);
      const ev = createEvent<number>();
      store.on(ev, (state, payload) => state + payload);

      const run = timer(ev, 200);

      run(2);
      await wait(200);
      ev(3);

      expect(store.get()).toBe(6);
   });

   it('interval', async () => {
      const store = createStore(1);
      const ev = createEvent<number>();
      store.on(ev, (state, payload) => state + payload);

      const run = timer(ev, 200, 5);

      run(2);
      await wait(200);
      await wait(5);
      await wait(5);
      ev(3);

      expect(store.get()).toBe(8);
   });
});
