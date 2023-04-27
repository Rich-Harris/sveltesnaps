import { sql } from '$lib/server/database.js';
import type { AccountDetails, PhotoDetails } from '$lib/types.js';
import { error } from '@sveltejs/kit';

export async function load({ locals, params }) {
	const [account] = locals.user
		? await sql`
			SELECT a.*,
				CASE WHEN f.account_id IS NOT NULL THEN TRUE ELSE FALSE END AS followed_by_user
			FROM account a
			LEFT JOIN follows f ON a.id = f.following_id AND f.account_id = ${locals.user.id}
			WHERE a.name = ${params.account};
		`
		: await sql`
			SELECT *, FALSE AS followed_by_user FROM account WHERE name = ${params.account}
		`;

	if (!account) {
		throw error(404);
	}

	const photos = await sql`
		SELECT p.*, COUNT(DISTINCT l.account_id) AS num_likes, COUNT(DISTINCT c.id) AS num_comments
		FROM photo p
		LEFT JOIN likes l ON p.id = l.photo_id
		LEFT JOIN comment c ON p.id = c.photo_id
		WHERE p.account_id = ${account.id}
		GROUP BY p.id
		ORDER BY p.created_at DESC
		LIMIT 10;
	`;

	return {
		account: account as AccountDetails,
		photos: Array.from(photos) as PhotoDetails[]
	};
}

export const actions = {
	toggle_follow: async ({ locals, params, request }) => {
		if (!locals.user) throw error(401);

		const data = await request.formData();
		const id = data.get('id') as string;
		const followed = data.get('followed') === 'true';

		if (!id) throw error(422);

		if (followed) {
			await sql`
				INSERT INTO follows (account_id, following_id)
				VALUES (${locals.user.id}, ${id})
				ON CONFLICT DO NOTHING
			`;
		} else {
			await sql`
				DELETE FROM follows
				WHERE account_id = ${locals.user.id}
				AND following_id = ${id}
			`;
		}
	}
};
