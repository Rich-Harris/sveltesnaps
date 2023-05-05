import { sql } from '$lib/server/database.js';
import type { Account, Comment, PhotoListItem } from '$lib/types.js';
import { error, redirect } from '@sveltejs/kit';

export async function load({ params }) {
	const [photo] = await sql`
		SELECT p.*, a.name, a.avatar
		FROM photo p
		INNER JOIN account a ON p.account_id = a.id
		WHERE p.id = ${params.photo}
		AND p.published = TRUE
		AND a.name = ${params.account}
	`;

	if (!photo) {
		throw error(404);
	}

	const comments = await sql`
		SELECT c.*, a.name, a.avatar
		FROM comment c
		INNER JOIN account a ON c.account_id = a.id
		WHERE c.photo_id = ${params.photo}
		ORDER BY c.created_at DESC
	`;

	const likes = await sql`
		SELECT a.name, a.avatar
		FROM likes l
		INNER JOIN account a ON l.account_id = a.id
		WHERE l.photo_id = ${params.photo}
		ORDER BY l.created_at DESC
	`;

	return {
		photo: photo as PhotoListItem,
		comments: Array.from(comments) as Comment[],
		likes: Array.from(likes) as Account[]
	};
}

export const actions = {
	toggle_like: async ({ locals, params, request }) => {
		if (!locals.user) throw error(401);

		const data = await request.formData();

		const liked = data.get('liked') === 'true';

		if (liked) {
			await sql`
				INSERT INTO likes (account_id, photo_id)
				VALUES (${locals.user.id}, ${params.photo})
				ON CONFLICT DO NOTHING
			`;
		} else {
			await sql`
				DELETE FROM likes
				WHERE account_id = ${locals.user.id}
				AND photo_id = ${params.photo}
			`;
		}
	},

	delete_photo: async ({ locals, params }) => {
		if (!locals.user) throw error(401);
		if (locals.user.name !== params.account) throw error(403);

		await sql`
			DELETE FROM photo
			WHERE id = ${params.photo}
		`;

		throw redirect(303, `/${params.account}`);
	},

	update_description: async ({ locals, params, request }) => {},

	post_comment: async ({ locals, params, request }) => {
		if (!locals.user) throw error(401);

		const data = await request.formData();

		const text = data.get('text') as string;
		if (!text) throw error(422);

		const [{ id }] = await sql`
			INSERT INTO comment (account_id, photo_id, text)
			VALUES (${locals.user.id}, ${params.photo}, ${text})
			returning id;
		`;

		return { id };
	},

	delete_comment: async ({ locals, request }) => {
		if (!locals.user) throw error(401);

		const data = await request.formData();

		const id = data.get('id') as string;
		if (!id) throw error(422);

		await sql`
			DELETE FROM comment
			WHERE id = ${id}
			AND account_id = ${locals.user.id}
		`;
	}
};
