import { POSTGRES_URL } from '$env/static/private';
import type { AccountDetails, PhotoDetails } from '$lib/types';
import type { Account, Comment, Photo } from '$lib/types';
import postgres from 'postgres';

export const sql = postgres(POSTGRES_URL, {
	ssl: 'require'
});

export async function get_account_from_name(name: string, user_id: string | undefined) {
	const [account] = user_id
		? await sql`
			SELECT a.*,
				CASE WHEN f.account_id IS NOT NULL THEN TRUE ELSE FALSE END AS followed_by_user
			FROM account a
			LEFT JOIN follows f ON a.id = f.following_id AND f.account_id = ${user_id}
			WHERE a.name = ${name};
		`
		: await sql`
			SELECT *, FALSE AS followed_by_user FROM account WHERE name = ${name}
		`;

	return account as AccountDetails;
}

export async function get_photos_from_account_id(account_id: string, user_id: string | undefined) {
	const photos = await sql`
		SELECT p.*, COUNT(DISTINCT l.account_id) AS num_likes, COUNT(DISTINCT c.id) AS num_comments
		FROM photo p
		LEFT JOIN likes l ON p.id = l.photo_id
		LEFT JOIN comment c ON p.id = c.photo_id
		WHERE p.account_id = ${account_id}
		GROUP BY p.id
		ORDER BY p.created_at DESC
		LIMIT 10;
	`;

	return Array.from(photos) as PhotoDetails[];
}

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

export function login({ name, avatar }: { name: string; avatar: string }) {
	return sql.begin(async (sql) => {
		const [account] = await sql`
			INSERT INTO account (name, avatar)
			VALUES (${name}, ${avatar})
			ON CONFLICT (name) DO UPDATE SET avatar = EXCLUDED.avatar
			RETURNING id
		`;

		const [session] = await sql`
			INSERT INTO session (account_id)
			VALUES (${account.id})
			RETURNING id
		`;

		return {
			id: session.id as string
		};
	});
}

export async function logout(session_id: string) {
	await sql`
		DELETE FROM session
		WHERE id = ${session_id}
	`;
}
