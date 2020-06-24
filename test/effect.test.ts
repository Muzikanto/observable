import createEffect from '../src/createEffect';
import { IEffect } from '../src';

function request(time: number, err?: boolean) {
   return new Promise((resolve: (response: string) => void, reject: (err: string) => void) => {
      setTimeout(() => {
         if (err) {
            reject('error');
         }

         resolve('response');
      }, time);
   });
}

function getEffect(err?: boolean) {
   return createEffect(async (v: number) => {
      const response = await request(250, err);

      return response;
   });
}

describe('Effect', () => {
   let effect: IEffect<number, string>;

   describe('success', () => {
      beforeEach(() => {
         effect = getEffect();
      });

      it('base', async () => {
         const data = await effect(1);

         expect(data).toBe('response');
      });

      it('done watch', async () => {
         await effect(1);

         effect.done.watch((response) => {
            expect(response).toBe('response');
         });
      });

      it('loading', async () => {
         let arr: boolean[] = [];

         effect.loading.watch((loading) => {
            arr.push(loading);
         });

         try {
            await effect(1);
         } catch (e) {}

         expect(arr).toEqual([true, false]);
      });

      it('cache', async () => {
         let v = 0;
         const cachebleEffect = createEffect(
            async () => {
               v++;
               return v;
            },
            { cache: true },
         );

         const data = await cachebleEffect(1);
         expect(data).toEqual(1);
         const data2 = await cachebleEffect(1);
         expect(data2).toEqual(1);
         const data3 = await cachebleEffect(1);
         expect(data3).toEqual(1);
      });

      it('no cache', async () => {
         let v = 0;
         const cachebleEffect = createEffect(async () => {
            v++;
            return v;
         });

         const data = await cachebleEffect(1);
         expect(data).toEqual(1);
         const data2 = await cachebleEffect(1);
         expect(data2).toEqual(2);
         const data3 = await cachebleEffect(1);
         expect(data3).toEqual(3);
      });
   });

   describe('fail', () => {
      beforeEach(() => {
         effect = getEffect(true);
      });

      it('base', async () => {
         effect(1).then(() => {
            expect(true).toBe(true);
         });
      });

      it('fail watch', async () => {
         effect.fail.watch((error) => {
            expect(error).toBe('error');
         });

         try {
            await effect(1);
         } catch (e) {}
      });

      it('loading', async () => {
         let arr: boolean[] = [];

         effect.loading.watch((loading) => {
            arr.push(loading);
         });

         try {
            await effect(1);
         } catch (e) {}

         expect(arr).toEqual([true, false]);
      });
   });
});
