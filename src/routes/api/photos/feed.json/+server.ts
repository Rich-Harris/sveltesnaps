import { sql } from '$lib/server/database.js';
import { PAGE_SIZE } from '$lib/utils.js';
import { error, json } from '@sveltejs/kit';

export async function GET({ locals, url }) {
	if (!locals.user) {
		throw error(401);
	}

	const start = url.searchParams.get('start') ?? sql`now()`;

	const photos = await sql`
		SELECT p.*,
			a.name,
			a.avatar,
			COALESCE(l.num_likes, 0) AS num_likes,
			COALESCE(c.num_comments, 0) AS num_comments,
			CASE WHEN ul.photo_id IS NOT NULL THEN TRUE ELSE FALSE END AS liked_by_user
		FROM photo p
		JOIN account a ON p.account_id = a.id
		LEFT JOIN (
			SELECT photo_id, COUNT(*) AS num_likes
			FROM likes
			GROUP BY photo_id
		) l ON p.id = l.photo_id
		LEFT JOIN (
			SELECT photo_id, COUNT(*) AS num_comments
			FROM comment
			GROUP BY photo_id
		) c ON p.id = c.photo_id
		LEFT JOIN likes ul ON p.id = ul.photo_id AND ul.account_id = ${locals.user.id}
		WHERE (p.account_id IN (
			SELECT following_id
			FROM follows
			WHERE account_id = ${locals.user.id}
		)
		OR p.account_id = ${locals.user.id})
		AND p.created_at < ${start}
		ORDER BY p.created_at DESC
		LIMIT ${PAGE_SIZE + 1};
	`;

	const next = photos.length > PAGE_SIZE ? photos.pop()!.created_at : null;

	return json({
		photos: Array.from(photos).map((photo) => ({
			...photo,
			num_likes: Number(photo.num_likes),
			num_comments: Number(photo.num_comments)
		})),
		next
	});
}
