import { get_account_from_name, get_photos_from_account_id, sql } from '$lib/server/database.js';
import { error } from '@sveltejs/kit';

export async function load({ locals, params }) {
	const account = await get_account_from_name(params.account, locals.user?.id);

	if (!account) {
		throw error(404);
	}

	const photos = await get_photos_from_account_id(account.id, locals.user?.id);

	return {
		account,
		photos
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
