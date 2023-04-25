import { DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET } from '$env/static/private';
import { login } from '$lib/server/database.js';
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

	const { access_token } = await get_token(code);
	const user = await get_user(access_token);

	const session = await login({
		name: user.username,
		avatar: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp`
	});

	cookies.set('session', session.id, { path: '/' });

	throw redirect(307, '/');
}

async function get_token(code: string) {
	const data = new URLSearchParams({
		code,
		grant_type: 'authorization_code',
		redirect_uri: 'http://localhost:5173/auth/callback',
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
