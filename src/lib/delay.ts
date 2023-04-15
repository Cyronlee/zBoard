export const delay1s = <T>(func: () => T) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(func()), 1000));
