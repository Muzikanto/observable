import Effect, { IEffect } from './Effect';
import { IEvent } from './Event';

function createEffect<Req, Res, Err = Error>(
   handler: (params: Req) => Promise<Res>,
   options?: {
      done?: IEvent<Res>;
      fail?: IEvent<Err>;
      loading?: IEvent<boolean>;
      cache?: boolean;
      cacheTime?: number;
   },
): IEffect<Req, Res, Err> {
   return new Effect<Req, Res, Err>(handler, options).call;
}

export default createEffect;
