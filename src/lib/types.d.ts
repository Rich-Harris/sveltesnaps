export interface Account {
	id: string;
	created_at: Date;
	name: string;
	avatar: string;
}

export interface AccountDetails extends Account {
	followed_by_user: boolean;
}

export interface Photo {
	id: string;
	created_at: Date;
	url: string;
	width: number;
	height: number;
	description: string;
	likes: number;
	published: boolean;
}

export interface PhotoListItem extends Photo {
	name: string;
	avatar: string;
	num_likes: number;
	num_comments: number;
	liked_by_user: boolean;
}

export interface Comment {
	id: string;
	created_at: Date;
	photo_id: string;
	name: string;
	avatar: string;
	text: string;
}
