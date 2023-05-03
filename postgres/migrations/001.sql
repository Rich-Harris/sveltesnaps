CREATE TABLE account (
	id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
	created_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'),
	discord_id TEXT NOT NULL,
	name TEXT NOT NULL,
	avatar TEXT,
	UNIQUE(discord_id)
);

CREATE TABLE follows (
	created_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'),
	account_id UUID NOT NULL,
	following_id UUID NOT NULL,
	UNIQUE(account_id, following_id)
);

CREATE TABLE likes (
	created_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'),
	account_id UUID NOT NULL,
	photo_id UUID NOT NULL,
	UNIQUE(account_id, photo_id)
);

CREATE TABLE photo (
	id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
	created_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'),
	account_id UUID NOT NULL,
	FOREIGN KEY (account_id) REFERENCES account (id),
	url TEXT NOT NULL,
	width INTEGER NOT NULL,
	height INTEGER NOT NULL,
	description TEXT NOT NULL,
	published boolean NOT NULL DEFAULT false
);

CREATE TABLE comment (
	id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
	created_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'),
	account_id UUID NOT NULL,
	FOREIGN KEY (account_id) REFERENCES account (id),
	photo_id UUID NOT NULL,
	FOREIGN KEY (photo_id) REFERENCES photo (id),
	text TEXT NOT NULL
);

CREATE TABLE session (
	id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
	created_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'UTC'),
	account_id UUID NOT NULL,
	FOREIGN KEY (account_id) REFERENCES account (id)
);