import { sql } from '$lib/server/database.js';
import type { AccountDetails, PhotoDetails } from '$lib/types.js';
import { error } from '@sveltejs/kit';

export async function load({ locals, params, fetch }) {
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

	// we _could_ load the data directly here, but we also want to be able to fetch
	// the data directly from the browser for the sake of infinite scroll,
	// so we use an API route instead
	const response = await fetch(`/api/photos/${account.id}.json`);
	const { photos, next } = await response.json();

	return {
		account: account as AccountDetails,
		photos: photos as PhotoDetails[],
		next
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
