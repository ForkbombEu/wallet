import { zencode_exec } from 'zenroom';

type ExtendableRecord = Record<string, unknown>;

export async function zencodeExec<
	Data extends ExtendableRecord = ExtendableRecord,
	Output extends ExtendableRecord = ExtendableRecord
>(contract: string, data: Data): Promise<Output> {
	try {
		const { result } = await zencode_exec(contract, { data: JSON.stringify(data) });
		return JSON.parse(result);
	} catch (e: any) {
		const rawMsg = e?.logs ?? e?.result ?? e?.message ?? e;
		const msg = typeof rawMsg === 'string' ? rawMsg : JSON.stringify(rawMsg);
		throw new Error(`Zenroom error: ${msg}`);
	}
}
