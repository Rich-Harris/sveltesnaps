import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';
import { create_photo } from '$lib/server/database.js';
import { error, redirect } from '@sveltejs/kit';
import * as blob from '@vercel/blob';

export async function load({ locals }) {}

export const actions = {
	post: async ({ locals, request }) => {
		if (!locals.account) {
			throw error(401);
		}

		const form = await request.formData();

		const file = form.get('file') as File;
		const description = form.get('description') as string;

		console.log({ file, description });

		if (!file || !description) {
			throw error(422);
		}

		const ext = file.name.split('.').at(-1);
		const name = `${locals.account.id}/${Date.now()}.${ext}`;

		const { url } = await blob.put(name, file, {
			access: 'public',
			token: BLOB_READ_WRITE_TOKEN
		});

		const photo = await create_photo(locals.account.id, url, description);
		throw redirect(303, `/${locals.account.name}/${photo.id}`);
	}
};
