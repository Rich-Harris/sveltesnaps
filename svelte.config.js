import adapter from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({ runtime: 'edge', region: 'iad' })
	},

	vitePlugin: {
		experimental: {
			inspector: {
				holdMode: true
			}
		}
	}
};

export default config;
