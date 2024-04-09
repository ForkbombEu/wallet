import { PUBLIC_BACKEND_URL } from '$env/static/public';

export const backendUri = PUBLIC_BACKEND_URL || 'https://admin.didroom.com';
export const filesUri = backendUri + '/files';
export const authFilesUri = backendUri + '/files/_pb_users_auth_';