import createEvent from "./createEvent";

export type IEffect<Req, Res, Err = Error> = (request: Req) => Promise<Res>;

class Effect<Req, Res, Err = Error> {
    public done = createEvent<Res>();
    public fail = createEvent<Err>();
    public loading = createEvent<boolean>();
    protected handler: (params: Req) => Promise<Res>;

    constructor(handler: (params: Req) => Promise<Res>) {
        this.handler = handler;
    }

    public call(request: Req) {
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
    }
}

export default Effect;
