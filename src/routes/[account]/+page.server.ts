import { get_account_from_name, get_photos_from_account_id } from '$lib/server/database.js';
import { error } from '@sveltejs/kit';

export async function load({ params }) {
	const account = await get_account_from_name(params.account);

	if (!account) {
		throw error(404);
	}

	const photos = await get_photos_from_account_id(account.id);

	return {
		account,
		photos
	};
}
