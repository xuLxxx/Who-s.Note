export const debounce = (func: Function, delay: number) => {
  let timer: NodeJS.Timeout | null = null;
  return (...args: any[]) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};
