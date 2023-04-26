import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';
import { create_photo, sql } from '$lib/server/database.js';
import type { PhotoDetails } from '$lib/types.js';
import { error, redirect } from '@sveltejs/kit';
import * as blob from '@vercel/blob';

export async function load({ locals }) {
	if (locals.user) {
		const photos = await sql`
			SELECT p.*,
				a.name,
				a.avatar,
				COALESCE(l.num_likes, 0) AS num_likes,
				COALESCE(c.num_comments, 0) AS num_comments,
				CASE WHEN ul.photo_id IS NOT NULL THEN TRUE ELSE FALSE END AS liked_by_user
			FROM photo p
			JOIN account a ON p.account_id = a.id
			LEFT JOIN (
				SELECT photo_id, COUNT(*) AS num_likes
				FROM likes
				GROUP BY photo_id
			) l ON p.id = l.photo_id
			LEFT JOIN (
				SELECT photo_id, COUNT(*) AS num_comments
				FROM comment
				GROUP BY photo_id
			) c ON p.id = c.photo_id
			LEFT JOIN likes ul ON p.id = ul.photo_id AND ul.account_id = ${locals.user.id}
			WHERE p.account_id IN (
				SELECT following_id
				FROM follows
				WHERE account_id = ${locals.user.id}
			)
			OR p.account_id = ${locals.user.id}
			ORDER BY p.created_at DESC;
		`;

		return {
			photos: Array.from(photos) as PhotoDetails[]
		};
	}

	return {
		photos: null
	};
}

export const actions = {
	post: async ({ locals, request }) => {
		if (!locals.user) {
			throw error(401);
		}

		const form = await request.formData();

		const file = form.get('file') as File;
		const description = form.get('description') as string;
		const width = form.get('width') as string;
		const height = form.get('height') as string;

		if (!file || !description) {
			throw error(422);
		}

		const ext = file.name.split('.').at(-1);
		const name = `${locals.user.id}/${Date.now()}.${ext}`;

		const { url } = await blob.put(name, file, {
			access: 'public',
			token: BLOB_READ_WRITE_TOKEN
		});

		const { id } = await create_photo(locals.user.id, url, +width, +height, description);
		throw redirect(303, `/${locals.user.name}/${id}`);
	}
};
