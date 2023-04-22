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

export const isImage = async (url: string) => {
  const res = await fetch(url, { method: "GET" });
  const type = res.headers.get("content-type");
  return type ? type.includes("image") : false;
};
