import { writable } from 'svelte/store';
import type { Account, Comment, Photo, PhotoListItem } from './types';
import { getContext, setContext } from 'svelte';

const key = {};

function init() {
	const { subscribe, update } = writable(
		{} as {
			[id: string]: {
				num_comments: number;
				num_likes: number;
				liked_by_user: boolean;
			};
		}
	);

	const state = { subscribe };

	function init_photos(photos: PhotoListItem[]) {
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

	function update_photo(photo: Photo, comments: Comment[], likes: Account[], user?: Account) {
		update((lookup) => {
			lookup[photo.id] = {
				num_comments: comments.length,
				num_likes: likes.length,
				liked_by_user: !!user && likes.some((like) => like.name === user.name)
			};
			return lookup;
		});
	}

	return { state, init_photos, update_photo };
}

export function setStateContext() {
	setContext(key, init());
}

export function getStateContext() {
	return getContext(key) as ReturnType<typeof init>;
}
