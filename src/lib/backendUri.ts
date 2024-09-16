import { PUBLIC_BACKEND_URL } from '$env/static/public';

const api = '/api';
const files = `${api}/files`;
const userCollectionId = '_pb_users_auth_';

export const backendUri = PUBLIC_BACKEND_URL || 'https://staging.admin.didroom.com';
export const filesUri = (fileName: string, collection: string, id: string) =>
	`${backendUri}${files}/${collection}/${id}/${fileName}`;
export const authFilesUri = (fileName: string | undefined, userId: string | undefined) =>
	fileName && userId && filesUri(fileName, userCollectionId, userId);
