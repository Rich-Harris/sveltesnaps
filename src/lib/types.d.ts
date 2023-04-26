export interface Account {
	id: string;
	created_at: Date;
	name: string;
	avatar: string;
}

export interface Photo {
	id: string;
	created_at: Date;
	url: string;
	width: number;
	height: number;
	description: string;
	likes: number;
}

export interface PhotoDetails extends Photo {
	name: string;
	avatar: string;
}

export interface Comment {
	id: string;
	created_at: Date;
	photo_id: string;
	name: string;
	avatar: string;
	text: string;
}
