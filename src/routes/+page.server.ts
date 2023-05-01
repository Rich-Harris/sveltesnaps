import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';
import { create_photo, sql } from '$lib/server/database.js';
import type { PhotoDetails } from '$lib/types.js';
import { error, redirect } from '@sveltejs/kit';
import * as blob from '@vercel/blob';

export async function load({ locals, fetch, url }) {
	if (locals.user) {
		const response = await fetch(
			`/api/photos/feed.json?start=${url.searchParams.get('start') || ''}`
		);
		const { photos, next } = await response.json();

		return {
			photos: photos as PhotoDetails[],
			next: next as string
		};
	}

	return {
		photos: [] as PhotoDetails[],
		next: null
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
