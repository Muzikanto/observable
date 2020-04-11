import Observable from './Observable';

function isStore<T>(value: T) {
   return value instanceof Observable;
}

export default isStore;
