export type ValueOf<T> = T[keyof T];

export type Feedback = { type?: "success" | "error"; message?: string; feedback?: string };
