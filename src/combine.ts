import createStore from "./createStore";
import {Store} from "./Observable";

function combine<S, Map extends { [key: string]: any }>(map: { [k in keyof Map]: Store<Map[k]> }, func: (map: Map) => S): Store<S> {
    const next = () => {
        const state = Object.keys(map).reduce((acc, key) => ({...acc, [key]: map[key].get()}), {} as Map) as Map;

        return func(state);
    };
    const store = createStore(next());

    for (const key in map) {
        map[key].watch(next);
    }

    return store;
}

export default combine;
