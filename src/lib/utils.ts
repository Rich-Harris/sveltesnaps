export function startViewTransition(fn) {
	if (document.startViewTransition) {
		document.startViewTransition(fn);
	}

	fn();
}
