import { browser } from '$app/environment';
import type { PhotoListItem } from './types';

const _photos = new Map<string, PhotoListItem>();

/**
 * Update the cache of photos given the latest photos.
 */
export function set_latest<T extends PhotoListItem | PhotoListItem[]>(photos: T): T {
	if (browser) {
		const p = Array.isArray(photos) ? photos : [photos];
		p.forEach((photo) => _photos.set(photo.id, photo));
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
		const photo = _photos.get(id);
		if (photo) {
			photos.push(photo);
		} else {
			return null;
		}
	}

	return photos;
}
