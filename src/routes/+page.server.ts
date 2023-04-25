import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';
import { create_photo } from '$lib/server/database.js';
import { error } from '@sveltejs/kit';
import * as blob from '@vercel/blob';

export async function load({ locals }) {}

export const actions = {
	post: async ({ locals, request }) => {
		if (!locals.account) {
			throw error(401);
		}

		const form = await request.formData();

		const photo = form.get('photo') as File;
		const description = form.get('description') as string;

		if (!photo || !description) {
			throw error(422);
		}

		const ext = photo.name.split('.').at(-1);
		const name = `${locals.account.id}/${Date.now()}.${ext}`;

		const { url } = await blob.put(name, photo, {
			access: 'public',
			token: BLOB_READ_WRITE_TOKEN
		});

		return await create_photo(locals.account.id, url, description);
	}
};
