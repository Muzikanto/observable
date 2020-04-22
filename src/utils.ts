function deepCopy<S>(state: S): S {
   if (typeof state !== 'object' || state instanceof Date) {
      return state;
   }

   const result: any = Array.isArray(state) ? [] : {};

   // tslint:disable-next-line:forin
   for (const key in state) {
      result[key] = deepCopy(state[key]);
   }

   return result;
}

export { deepCopy };
