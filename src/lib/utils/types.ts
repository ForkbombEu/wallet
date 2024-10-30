export type ValueOf<T> = T[keyof T];

export type Feedback = { type?: 'success' | 'error'; message?: string; feedback?: string };

export type Logo = { uri: string; alt_text: string };
