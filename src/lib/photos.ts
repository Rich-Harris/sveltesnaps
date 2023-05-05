import { browser } from '$app/environment';
import type { Photo, PhotoListItem } from './types';

const cache = new Map<string, PhotoListItem>();

/**
 * Update the cache of photos given the latest photo.
 */
export function update_photo(
	photo: Photo,
	num_comments: number,
	num_likes: number,
	liked_by_user: boolean
) {
	if (browser) {
		const current = cache.get(photo.id);
		if (current) {
			cache.set(photo.id, { ...current, ...photo, num_comments, num_likes, liked_by_user });
		}
	}

	return photo;
}

/**
 * Update the cache of photos given the latest photos.
 */
export function update_photos(photos: PhotoListItem[]) {
	if (browser) {
		photos.forEach((photo) => cache.set(photo.id, photo));
	}

	return photos;
}

/**
 * Get the photo details for the given photo ids. Returns null if any of the
 * ids are not in the cache.
 */
export function get_photos_from_ids(ids: string[]) {
	const photos: PhotoListItem[] = [];

	for (const id of ids) {
		const photo = cache.get(id);
		if (photo) {
			photos.push(photo);
		} else {
			return null;
		}
	}

	return photos;
}
