import { writable } from 'svelte/store';
import type { Account, Comment, Photo, PhotoListItem } from './types';

// note: this store will leak memory on the server! luckily, we're using
// serverless functions, which means we don't need to care — the
// function won't be kept alive long enough for it to matter.

const { subscribe, update } = writable(
	{} as {
		[id: string]: {
			num_comments: number;
			num_likes: number;
			liked_by_user: boolean;
		};
	}
);

export const state = { subscribe };

export function init_photos(photos: PhotoListItem[]) {
	update((lookup) => {
		for (const photo of photos) {
			if (!lookup[photo.id]) {
				lookup[photo.id] = {
					num_comments: photo.num_comments,
					num_likes: photo.num_likes,
					liked_by_user: photo.liked_by_user
				};
			}
		}

		return lookup;
	});
}

export function update_photo(photo: Photo, comments: Comment[], likes: Account[], user?: Account) {
	update((lookup) => {
		lookup[photo.id] = {
			num_comments: comments.length,
			num_likes: likes.length,
			liked_by_user: !!user && likes.some((like) => like.name === user.name)
		};
		return lookup;
	});
}
