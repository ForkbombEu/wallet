import { registerPlugin } from '@capacitor/core';
import { TEEPluginWeb } from './TEEPlugin.web';

export type NativeResult<T> = { success: true; result: T } | { success: false; error: string };

export interface TEEPlugin {
	generateKey(): Promise<NativeResult<string>>;
	listAliases(): Promise<NativeResult<string[]>>;
	doEncrypt(options: { msg: string }): Promise<NativeResult<string>>;
	doDecrypt(options: { msg: string }): Promise<NativeResult<string>>;
}

const TEE = registerPlugin<TEEPlugin>('TEE', {
	web: new TEEPluginWeb()
});

export default TEE;
