import createDomain, { Domain } from '../src/createDomain';

describe('domain', () => {
   let domain: Domain;

   beforeEach(() => {
      domain = createDomain();
   });

   it('onCreateEvent', () => {
      let v = 1;

      domain.onCreateEvent(() => {
         v++;
      });

      domain.createEvent();
      domain.createEvent();

      expect(v).toBe(3);
   });

   it('onCreateStore', () => {
      let v = 1;

      domain.onCreateStore(() => {
         v++;
      });

      domain.createStore(1);
      domain.createStore(2);

      expect(v).toBe(3);
   });

   it('onCreateEffect', () => {
      let v = 1;

      domain.onCreateEffect(() => {
         v++;
      });

      domain.createEffect(async () => 1);
      domain.createEffect(async () => 2);

      expect(v).toBe(3);
   });
});
