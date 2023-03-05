export const isServer = typeof window === "undefined";

export const isNotNull = <T>(v: T | null): v is T => {
  return v !== null;
};

export const isString = (s: any): s is string => {
  return typeof s === "string" || s instanceof String;
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
