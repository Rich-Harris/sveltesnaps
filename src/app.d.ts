// See https://kit.svelte.dev/docs/types#app

import type { Account } from '$lib/types';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			account?: Account;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
