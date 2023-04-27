import { get_photo_details, sql } from '$lib/server/database.js';
import { error, redirect } from '@sveltejs/kit';

export async function load({ params }) {
	const { photo, comments, likes } = await get_photo_details(params.account, params.photo);

	if (!photo) {
		throw error(404);
	}

	return {
		photo,
		comments,
		likes
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

		await sql`
			INSERT INTO comment (account_id, photo_id, text)
			VALUES (${locals.user.id}, ${params.photo}, ${text})
		`;
	},

	delete_comment: async ({ locals, params, request }) => {
		if (!locals.user) throw error(401);

		const data = await request.formData();

		const id = data.get('id') as string;
		if (!id) throw error(422);

		await sql`
			DELETE FROM comment
			WHERE id = ${id}
		`;
	}
};
