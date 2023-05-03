import { dev } from '$app/environment';

export function optimize(url: string, widths = [640, 960, 1280], quality = 75) {
	if (dev) return url;

	return widths
		.map((width) => {
			return `/_vercel/image?url=${encodeURIComponent(url)}&w=${width}&q=${quality} ${width}w`;
		})
		.join(', ');
}
