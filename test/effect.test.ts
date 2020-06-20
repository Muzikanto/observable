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
   });

   describe('fail', () => {
      beforeEach(() => {
         effect = getEffect(true);
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
