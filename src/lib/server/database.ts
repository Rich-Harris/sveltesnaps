import { POSTGRES_URL } from '$env/static/private';
import type { PhotoDetails } from '$lib/types';
import type { Account, Comment, Photo } from '$lib/types';
import postgres from 'postgres';

export const sql = postgres(POSTGRES_URL, {
	ssl: 'require'
});

export async function get_photo_details(account_name: string, photo_id: string) {
	const [photo] = await sql`
		SELECT p.*, a.name, a.avatar
		FROM photo p
		INNER JOIN account a ON p.account_id = a.id
		WHERE p.id = ${photo_id}
		AND a.name = ${account_name}
	`;

	const comments = await sql`
		SELECT c.*, a.name, a.avatar
		FROM comment c
		INNER JOIN account a ON c.account_id = a.id
		WHERE c.photo_id = ${photo_id}
		ORDER BY c.created_at DESC
	`;

	const likes = await sql`
		SELECT a.name, a.avatar
		FROM likes l
		INNER JOIN account a ON l.account_id = a.id
		WHERE l.photo_id = ${photo_id}
		ORDER BY l.created_at DESC
	`;

	return {
		photo: photo as PhotoDetails,
		comments: Array.from(comments) as Comment[],
		likes: Array.from(likes) as Account[]
	};
}

export async function create_photo(
	account_id: string,
	url: string,
	width: number,
	height: number,
	description: string
) {
	const rows = await sql`
		INSERT INTO photo (account_id, url, width, height, description)
		VALUES (${account_id}, ${url}, ${width}, ${height}, ${description})
		RETURNING id
	`;

	const photo = rows[0];

	return {
		...photo,
		likes: 0
	} as Photo;
}
