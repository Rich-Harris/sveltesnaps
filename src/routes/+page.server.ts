import { BLOB_READ_WRITE_TOKEN } from '$env/static/private';
import { get_dimensions } from '$lib/image-size/index.js';
import { sql } from '$lib/server/database.js';
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
		const description = (form.get('description') as string) ?? '';

		if (!file) {
			throw error(422);
		}

		const ext = file.name.split('.').at(-1) as 'jpg' | 'png';
		const name = `${locals.user.id}/${Date.now()}.${ext}`;

		const data = await file.arrayBuffer();
		const { width, height } = get_dimensions(data, ext);

		const { url } = await blob.put(name, file, {
			access: 'public',
			token: BLOB_READ_WRITE_TOKEN
		});

		// if no description was provided, it means we came here via a no-JS
		// form submission, and we need to go to the `/publish` page to finish up
		const published = !!description;

		const [{ id }] = await sql`
			INSERT INTO photo (account_id, url, width, height, description, published)
			VALUES (${locals.user.id}, ${url}, ${width}, ${height}, ${description}, ${published})
			RETURNING id
		`;

		throw redirect(303, published ? `/${locals.user.name}/${id}` : `/publish?id=${id}`);
	}
};
