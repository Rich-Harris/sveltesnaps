import { redirect } from '@sveltejs/kit';
import { DISCORD_CLIENT_ID } from '$env/static/private';
import { sql } from '$lib/server/database.js';

export const actions = {
	login: async ({ cookies, url }) => {
		const auth = new URL('https://discord.com/oauth2/authorize');

		const state = crypto.randomUUID();
		cookies.set('discord_state', state, { path: '/' });

		auth.searchParams.set('response_type', 'code');
		auth.searchParams.set('client_id', DISCORD_CLIENT_ID);
		auth.searchParams.set('scope', 'identify');
		auth.searchParams.set('prompt', 'none');
		auth.searchParams.set('redirect_uri', `${url.origin}/auth/callback`);
		auth.searchParams.set('state', state);

		throw redirect(303, auth.href);
	},

	logout: async ({ cookies, locals }) => {
		const session_id = cookies.get('session');
		if (session_id) {
			await sql`
				DELETE FROM session
				WHERE id = ${session_id}
			`;

			cookies.delete('session', { path: '/' });
		}

		locals.user = undefined;
	}
};
