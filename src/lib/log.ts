import { dev } from '$app/environment';

export const log = dev ? console.log.bind(console) : () => {};
