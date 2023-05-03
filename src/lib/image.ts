import { dev } from '$app/environment';

export function optimize(url: string, widths = [640, 960, 1280], quality = 75) {
	if (dev) return url;

	return widths
		.map((width, i) => {
			const url = `/_vercel/image?url=${encodeURIComponent(url)}&w=${width}&q=${quality}`;
			const descriptor = i < widths.length - 1 ? ` ${width}w` : '';
			return url + descriptor;
		})
		.join(', ');
}
