import { sql } from '$lib/server/database.js';
import type { PhotoListItem } from '$lib/types.js';
import { error, redirect } from '@sveltejs/kit';

export async function load({ locals, url }) {
	if (!locals.user) {
		throw error(401);
	}

	const photo_id = url.searchParams.get('id');

	if (!photo_id) {
		throw error(400);
	}

	const [photo] = await sql`
		SELECT p.*, a.name, a.avatar
		FROM photo p
		INNER JOIN account a ON p.account_id = a.id
		WHERE p.id = ${photo_id}
		AND p.account_id = ${locals.user.id}
	`;

	if (!photo) {
		throw error(404);
	}

	if (photo.published) {
		throw redirect(307, `/${locals.user.name}/${photo.id}`);
	}

	return {
		photo: photo as PhotoListItem
	};
}

export const actions = {
	default: async ({ locals, request, url }) => {
		if (!locals.user) throw error(401);

		const photo_id = url.searchParams.get('id');
		if (!photo_id) throw error(400);

		const data = await request.formData();

		const description = data.get('description') as string;
		if (!description) throw error(422);

		const [row] = await sql`
			UPDATE photo
			SET description = ${description}, published = TRUE
			WHERE id = ${photo_id}
			AND account_id = ${locals.user.id}
			RETURNING id
		`;

		// if no update was possible, it's because the photo doesn't belong to the user
		if (!row) throw error(403);

		throw redirect(303, `/${locals.user.name}/${photo_id}`);
	}
};
