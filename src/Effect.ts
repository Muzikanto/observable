import createEvent from './createEvent';
import { IEvent } from './Event';

export type IEffect<Req, Res, Err = Error> = {
   (request: Req): Promise<Res>;
   done: IEvent<Res>;
   fail: IEvent<Err>;
   loading: IEvent<boolean>;
};

class Effect<Req, Res, Err = Error> {
   public done: IEvent<Res>;
   public fail: IEvent<Err>;
   public loading: IEvent<boolean>;
   protected handler: (params: Req) => Promise<Res>;
   protected callAt: Date | undefined = undefined;
   protected cacheData: Res | undefined = undefined;
   protected cacheTime: number = 60000;

   constructor(
      handler: (params: Req) => Promise<Res>,
      options: {
         done?: IEvent<Res>;
         fail?: IEvent<Err>;
         loading?: IEvent<boolean>;
         cache?: boolean;
         cacheTime?: number;
         ssr?: boolean;
      } = {},
   ) {
      this.handler = handler;
      const cacheble = options.cache;

      if (typeof options.cacheTime !== 'undefined') {
         this.cacheTime = options.cacheTime;
      }

      // @ts-ignore
      this.call = (request: Req) => {
         if (options.ssr === false) {
            return Promise.resolve();
         }

         this.loading(true);

         if (cacheble) {
            if (
               typeof this.callAt === 'undefined' ||
               typeof this.cacheData === 'undefined' ||
               (this.callAt && new Date().getTime() - this.callAt.getTime() > this.cacheTime)
            ) {
               return this.handler(request)
                  .then((response) => {
                     this.cacheData = response;
                     this.callAt = new Date();

                     this.done(response);
                     this.loading(false);

                     return response;
                  })
                  .catch((err) => {
                     this.fail(err);
                     this.loading(false);

                     throw err;
                  });
            } else {
               this.done(this.cacheData);
               this.loading(false);

               return this.cacheData;
            }
         }

         return this.handler(request)
            .then((response) => {
               this.done(response);
               this.loading(false);

               return response;
            })
            .catch((err) => {
               this.fail(err);
               this.loading(false);

               throw err;
            });
      };

      this.done = options.done ? options.done : createEvent<Res>();
      this.fail = options.fail ? options.fail : createEvent<Err>();
      this.loading = options.loading ? options.loading : createEvent<boolean>();

      Object.assign(this.call, this);
   }

   public call: IEffect<Req, Res, Err>;
}

export default Effect;
