export function smoothload(node: HTMLImageElement) {
	function load() {
		if (node.naturalWidth) return; // already loaded

		console.log(`loading ${node.src}`);

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
			console.log(mutation);
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
