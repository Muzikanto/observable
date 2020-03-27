import Observable from './Observable';

function createStore<T>(initialState: T) {
    return new Observable<T>(initialState);
}

export default createStore;
