export function smoothload(node: HTMLImageElement) {
	function load() {
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

export function trapfocus(node: HTMLElement) {
	const previous = document.activeElement as HTMLElement;

	function focusable(): HTMLElement[] {
		return Array.from(
			node.querySelectorAll(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			)
		);
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key !== 'Tab') return;

		const current = document.activeElement;

		const elements = focusable();
		const first = elements.at(0);
		const last = elements.at(-1);

		if (event.shiftKey && current === first) {
			last?.focus();
			event.preventDefault();
		}

		if (!event.shiftKey && current === last) {
			first?.focus();
			event.preventDefault();
		}
	}

	focusable()[0]?.focus();

	node.addEventListener('keydown', handleKeydown);

	return {
		destroy() {
			node.removeEventListener('keydown', handleKeydown);
			previous?.focus({ preventScroll: true });
		}
	};
}
