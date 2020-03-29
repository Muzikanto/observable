import Effect, {IEffect} from "./Effect";

function createEffect<Req, Res, Err = Error>(handler: (params: Req) => Promise<Res>): IEffect<Req, Res, Err> {
    return new Effect<Req, Res, Err>(handler).call;
}

export default createEffect;
