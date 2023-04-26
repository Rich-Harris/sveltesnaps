import { sql } from '$lib/server/database';
import type { Account } from '$lib/types';

export async function handle({ event, resolve }) {
	const session_id = event.cookies.get('session');

	if (session_id) {
		const [account] = await sql`
			SELECT account.*
			FROM account
			INNER JOIN session ON session.account_id = account.id
			WHERE session.id = ${session_id}
		`;

		event.locals.user = account as Account;
	}

	return resolve(event);
}
