import { readable } from 'svelte/store';

export function startViewTransition(fn) {
	if (document.startViewTransition) {
		document.startViewTransition(fn);
	}

	fn();
}

export function ago(a: Date, b: Date) {
	const ms = b.getTime() - a.getTime();

	if (ms < 10 * 1000) return 'a few seconds ago';
	if (ms < 60 * 1000) return 'less than a minute ago';

	const minutes = Math.floor(ms / (60 * 1000));

	if (minutes === 1) return 'a minute ago';
	if (minutes < 60) return `${minutes} minutes ago`;

	const hours = Math.floor(ms / (60 * 60 * 1000));

	if (hours === 1) return 'an hour ago';
	if (hours < 24) return `${hours} hours ago`;

	const a_day = new Date(a.getFullYear(), a.getMonth(), a.getDate());
	const b_day = new Date(b.getFullYear(), b.getMonth(), b.getDate());

	const days = Math.round((b_day.getTime() - a_day.getTime()) / (24 * 60 * 60 * 1000));

	if (days === 1) return 'yesterday';
	if (days < 7) return `${days} days ago`;
	if (days === 7) return 'a week ago';

	if (days < 28) return `${Math.ceil(days / 7)} weeks ago`;
	if (days < 335) return `${Math.ceil(days / (365 / 12))} months ago`;

	const years = Math.round(days / 365);
	return `${years} ${years === 1 ? 'year' : 'years'} ago`;
}

export const now = readable(new Date(), (set) => {
	const interval = setInterval(() => {
		set(new Date());
	}, 1000);

	return () => {
		clearInterval(interval);
	};
});
