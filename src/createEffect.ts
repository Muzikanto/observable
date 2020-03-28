import createEvent, {Event} from "./createEvent";

export type Effect<Req, Res, Err> =
    ((params: Req) => void)
    & { done: Event<Res>; fail: Event<Err>; loading: Event<boolean>; };

function createEffect<Req, Res, Err = {}>(handler: (params: Req) => Promise<Res>): Effect<Req, Res, Err> {
    const done = createEvent<Res>();
    const fail = createEvent<Err>();
    const loading = createEvent<boolean>();

    const requestFunc = (params: Req) => {
        loading(true);

        return new Promise(((resolve: (response: Res) => void, reject: (err: Err) => void) => {
            handler(params)
                .then((response) => {
                    done(response);
                    resolve(response);
                    loading(false);
                })
                .catch((err) => {
                    fail(err);
                    reject(err);
                    loading(false);
                })
        }));
    };

    requestFunc.done = done;
    requestFunc.fail = fail;
    requestFunc.loading = loading;

    return requestFunc;
}

export default createEffect;
