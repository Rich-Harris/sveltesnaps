import type { Size } from './types';

const decoder = new TextDecoder();

export function png(data: ArrayBuffer): Size {
	const bytes = new Uint8Array(data);

	if (decoder.decode(bytes.slice(1, 8)) === 'PNG\r\n\x1a\n') {
		const view = new DataView(data);
		let str = decoder.decode(bytes.slice(12, 16));

		// handle 'fried' PNGs https://github.com/esjeon/pngdefry
		if (str === 'CgBI') {
			if (decoder.decode(bytes.slice(28, 32)) === 'IHDR') {
				return {
					height: view.getUint32(36, false),
					width: view.getUint32(32, false)
				};
			}
		}

		if (str === 'IHDR') {
			return {
				height: view.getUint32(20, false),
				width: view.getUint32(16, false)
			};
		}
	}

	throw new TypeError('Invalid PNG');
}
