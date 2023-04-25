import { redirect } from '@sveltejs/kit';
import { DISCORD_CLIENT_ID } from '$env/static/private';
import { logout } from '$lib/server/database.js';

export const actions = {
	login: async ({ cookies }) => {
		const url = new URL('https://discord.com/oauth2/authorize');

		const state = crypto.randomUUID();
		cookies.set('discord_state', state, { path: '/' });

		url.searchParams.set('response_type', 'code');
		url.searchParams.set('client_id', DISCORD_CLIENT_ID);
		url.searchParams.set('scope', 'identify');
		url.searchParams.set('prompt', 'none');
		url.searchParams.set('redirect_uri', 'http://localhost:5173/auth/callback');
		url.searchParams.set('state', state);

		throw redirect(307, url.href);
	},

	logout: async ({ cookies, locals }) => {
		const session = cookies.get('session');
		if (session) await logout(session);

		cookies.delete('session', { path: '/' });
		locals.account = undefined;
	}
};
