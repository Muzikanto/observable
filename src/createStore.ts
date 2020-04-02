import Observable, {Store} from './Observable';

function createStore<T>(initialState: T): Store<T> {
    return new Observable<T>(initialState);
}

export default createStore;
