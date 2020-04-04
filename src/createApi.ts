import createStore from "./createStore";
import {Store} from "./Observable";
import createEvent from "./createEvent";
import {IEvent} from "./Event";

type ApiEvents<S, A> = {
    [K in keyof A]: A[K] extends (store: S, e: infer E) => S ? IEvent<E> : any
}

export type Api<S, A extends { [key: string]: (state: S, payload: any) => S }> =
    ApiEvents<S, A>
    & { store: Store<S>; };

function createApi<S, A extends { [key: string]: (state: S, payload: any) => S }>(state: S, api: A): Api<S, A> {
    const store = createStore(state);

    const events = Object.keys(api).reduce((acc: ApiEvents<S, A>, key: keyof A) => {
        const event = createEvent();

        store.on(event, api[key]);

        return {
            ...acc,
            [key]: event,
        };
    }, {} as ApiEvents<S, A>);

    return {
        store,
        ...events,
    };
}

export default createApi;
