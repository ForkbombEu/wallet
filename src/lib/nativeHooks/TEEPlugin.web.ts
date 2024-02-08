import { WebPlugin } from '@capacitor/core';
import type { NativeResult, TEEPlugin } from './TEEPlugin';

export class TEEPluginWeb extends WebPlugin implements TEEPlugin {
	async generateKey(): Promise<NativeResult<string>> {
		return { success: true, result: '' };
	}

	async listAliases(): Promise<NativeResult<string[]>> {
		return { success: true, result: [] };
	}

	async doEncrypt(options: { msg: string }): Promise<NativeResult<string>> {
		return { success: true, result: options.msg };
	}

	async doDecrypt(options: { msg: string }): Promise<NativeResult<string>> {
		return { success: true, result: options.msg };
	}
}
