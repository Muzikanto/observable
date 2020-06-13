import createEvent from './createEvent';
import { IEvent } from './Event';

export type IEffect<Req, Res, Err = Error> = {
   (request: Req): Promise<Res>;
   id: string;
   done: IEvent<Res>;
   fail: IEvent<Err>;
   loading: IEvent<boolean>;
};

class Effect<Req, Res, Err = Error> {
   public done: IEvent<Res>;
   public fail: IEvent<Err>;
   public loading: IEvent<boolean>;
   protected handler: (params: Req) => Promise<Res>;

   constructor(
      handler: (params: Req) => Promise<Res>,
      options?: { done?: IEvent<Res>; fail?: IEvent<Err>; loading?: IEvent<boolean> },
   ) {
      this.handler = handler;

      // @ts-ignore
      this.call = (request: Req) => {
         this.loading(true);

         return new Promise((resolve: (response: Res) => void, reject: (err: Err) => void) => {
            this.handler(request)
               .then((response) => {
                  this.done(response);
                  this.loading(false);
                  resolve(response);
               })
               .catch((err) => {
                  this.fail(err);
                  this.loading(false);
                  reject(err);
               });
         });
      };

      this.done = options && options.done ? options.done : createEvent<Res>();
      this.fail = options && options.fail ? options.fail : createEvent<Err>();
      this.loading = options && options.loading ? options.loading : createEvent<boolean>();

      Object.assign(this.call, this);
   }

   public call: IEffect<Req, Res, Err>;
}

export default Effect;
