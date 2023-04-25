import { get_account_from_session_id } from '$lib/server/database';

export async function handle({ event, resolve }) {
	const session_id = event.cookies.get('session');

	if (session_id) {
		event.locals.account = await get_account_from_session_id(session_id);
	}

	return resolve(event);
}
