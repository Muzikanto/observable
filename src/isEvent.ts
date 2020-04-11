function isEvent<T>(value: T) {
   // @ts-ignore
   return Boolean(value && typeof value === 'function' && typeof value.watch === 'function');
}

export default isEvent;
