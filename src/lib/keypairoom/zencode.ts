import { zencode_exec } from 'zenroom';

type ExtendableRecord = Record<string, unknown>;

export async function zencodeExec<
	Data extends ExtendableRecord = ExtendableRecord,
	Output extends ExtendableRecord = ExtendableRecord
>(contract: string, data: Data): Promise<Output> {
	const { result } = await zencode_exec(contract, { data: JSON.stringify(data) });
	return JSON.parse(result);
}
