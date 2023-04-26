import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } from '$env/static/private';
import { sql } from '$lib/server/database.js';
import { error, redirect } from '@sveltejs/kit';

export async function GET({ url, cookies }) {
	const state = url.searchParams.get('state');

	if (state !== cookies.get('discord_state')) {
		throw error(403);
	}

	const code = url.searchParams.get('code');

	if (!code) {
		throw new Error('callback URL was called without a code');
	}

	const { access_token } = await get_token(code, url.origin);
	const user = await get_user(access_token);

	const avatar = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`;

	const session = await sql.begin(async (sql) => {
		const [account] = await sql`
			INSERT INTO account (discord_id, name, avatar)
			VALUES (${user.id}, ${user.username}, ${avatar})
			ON CONFLICT (discord_id) DO UPDATE SET name = EXCLUDED.name, avatar = EXCLUDED.avatar
			RETURNING id
		`;

		const [session] = await sql`
			INSERT INTO session (account_id)
			VALUES (${account.id})
			RETURNING id
		`;

		return {
			id: session.id as string
		};
	});

	cookies.set('session', session.id, { path: '/' });

	throw redirect(307, '/');
}

async function get_token(code: string, origin: string) {
	const data = new URLSearchParams({
		code,
		grant_type: 'authorization_code',
		redirect_uri: `${origin}/auth/callback`,
		client_id: DISCORD_CLIENT_ID,
		client_secret: DISCORD_CLIENT_SECRET
	});

	const response = await fetch('https://discord.com/api/oauth2/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		},
		body: data.toString()
	});

	const json = await response.json();

	if (json.error) {
		throw new Error(json.error_description);
	}

	return json;
}

async function get_user(access_token: string) {
	const response = await fetch('https://discord.com/api/users/@me', {
		headers: {
			Authorization: `Bearer ${access_token}`
		}
	});

	const user = await response.json();

	return user;
}
