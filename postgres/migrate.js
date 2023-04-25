// @ts-check

import { loadEnv } from 'vite';
import postgres from 'postgres';
import * as fs from 'node:fs';

const env = loadEnv('production', '.', '');

const sql = postgres(env.POSTGRES_URL, {
	ssl: 'require'
});

await sql`
	CREATE TABLE IF NOT EXISTS _migration (
		id TEXT PRIMARY KEY NOT NULL,
		timestamp TIMESTAMP NOT NULL
	)
`;

await sql`
	CREATE TABLE IF NOT EXISTS _migration_lock (
		id TEXT PRIMARY KEY NOT NULL,
		is_locked BOOLEAN NOT NULL
	);
`;

await sql`
	INSERT INTO _migration_lock (
		id,
		is_locked
	) VALUES (
		'migration_lock',
		false
	) ON CONFLICT (id) DO NOTHING;
`;

await sql.begin(async (sql) => {
	const rows = await sql`
		WITH updated AS (
			UPDATE _migration_lock
			SET is_locked = true
			WHERE id = 'migration_lock' AND is_locked = false
			RETURNING id
		)
		SELECT id FROM updated;
	`;

	if (rows.length === 0) {
		throw new Error('migration is in progress');
	}

	const [latest] = await sql`
		SELECT id, timestamp FROM _migration
		ORDER BY timestamp DESC
		LIMIT 1
	`;

	if (latest) {
		console.log(`latest migration: ${latest.id} at ${latest.timestamp.toISOString()}`);
	} else {
		console.log(`no previous migrations found`);
	}

	const dir = new URL('migrations', import.meta.url);

	for (const file of fs.readdirSync(dir)) {
		if (file <= latest?.id) continue;
		if (!file.endsWith('.sql')) continue;

		console.log(`running migration ${file}`);

		await sql.file(new URL(`migrations/${file}`, import.meta.url));

		await sql`
			INSERT INTO _migration (id, timestamp) VALUES (${file}, ${new Date()})
		`;

		await new Promise((f) => setTimeout(f, 100));
	}

	await sql`
		UPDATE _migration_lock
		SET is_locked = false
		WHERE id = 'migration_lock'
	`;
});

await sql.end();
