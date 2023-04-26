export function smoothload(node: HTMLImageElement) {
	function load() {
		console.log('node.naturalWidth', node.naturalWidth);
		if (node.naturalWidth) return; // already loaded

		node.style.opacity = '0';
		node.style.transition = 'opacity 0.4s';

		node.addEventListener(
			'load',
			() => {
				node.style.opacity = '1';
			},
			{
				once: true
			}
		);
	}

	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.attributeName === 'src') {
				load();
			}
		}
	});

	observer.observe(node, {
		attributes: true
	});

	load();

	return {
		destroy() {
			observer.disconnect();
		}
	};
}
