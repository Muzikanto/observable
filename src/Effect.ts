import createEvent from "./createEvent";
import {IEvent} from './Event';

export type IEffect<Req, Res, Err = Error> = ((request: Req) => Promise<Res>) & { done: IEvent<Res>; fail: IEvent<Err>; loading: IEvent<boolean> };

class Effect<Req, Res, Err = Error> {
    public done = createEvent<Res>();
    public fail = createEvent<Err>();
    public loading = createEvent<boolean>();
    protected handler: (params: Req) => Promise<Res>;

    constructor(handler: (params: Req) => Promise<Res>) {
        this.handler = handler;

        // @ts-ignore
        this.call = (request: Req) => {
            this.loading(true);

            return new Promise(((resolve: (response: Res) => void, reject: (err: Err) => void) => {
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
                    })
            }));
        };
        this.call.done = this.done;
        this.call.fail = this.fail;
        this.call.loading = this.loading;
    }

    public call: IEffect<Req, Res, Err>;
}

export default Effect;
