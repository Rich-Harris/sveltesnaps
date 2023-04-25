CREATE TABLE account (
	id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	name TEXT NOT NULL,
	avatar TEXT NOT NULL,
	UNIQUE(name)
);

CREATE TABLE follows (
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	account_id UUID NOT NULL,
	following_id UUID NOT NULL,
	UNIQUE(account_id, following_id)
);

CREATE TABLE likes (
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	account_id UUID NOT NULL,
	photo_id UUID NOT NULL,
	UNIQUE(account_id, photo_id)
);

CREATE TABLE photo (
	id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	account_id UUID NOT NULL,
	FOREIGN KEY (account_id) REFERENCES account (id),
	url TEXT NOT NULL,
	description TEXT NOT NULL
);

CREATE TABLE comment (
	id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	account_id UUID NOT NULL,
	FOREIGN KEY (account_id) REFERENCES account (id),
	photo_id UUID NOT NULL,
	FOREIGN KEY (photo_id) REFERENCES photo (id),
	text TEXT NOT NULL
);

CREATE TABLE session (
	id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
	created_at TIMESTAMP NOT NULL DEFAULT NOW(),
	account_id UUID NOT NULL,
	FOREIGN KEY (account_id) REFERENCES account (id)
);