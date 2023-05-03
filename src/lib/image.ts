import { dev } from '$app/environment';

export function optimize(url: string, width = 1080, quality = 75) {
	return dev ? url : `/_vercel/image?url=${encodeURIComponent(url)}&w=${width}&q=${quality}`;
}
