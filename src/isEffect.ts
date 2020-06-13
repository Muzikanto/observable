function isEffect(value: any) {
   return Boolean(value && typeof value === 'function' && typeof value.done === 'function');
}

export default isEffect;
