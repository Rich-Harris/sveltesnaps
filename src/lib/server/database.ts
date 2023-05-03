import { POSTGRES_URL } from '$env/static/private';
import postgres from 'postgres';

export const sql = postgres(POSTGRES_URL, {
	ssl: 'require'
});
