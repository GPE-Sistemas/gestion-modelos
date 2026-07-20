// Helper de tipos genérico: queda TS puro, sin schema Zod (no tiene forma runtime).
export type Exactly<T, U> = {
  [K in keyof U]: K extends keyof T ? T[K] : never;
};
