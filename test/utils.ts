function wait(time: number) {
   return new Promise((resolve, reject) => {
      setTimeout(resolve, time);
   });
}

export { wait };
