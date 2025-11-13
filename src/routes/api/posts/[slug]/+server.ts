import { json, type RequestHandler } from '@sveltejs/kit';
import { getPostBySlug } from '$lib/db';

export const GET: RequestHandler = async ({ params }) => {
	const { slug } = params;

	try {
		const post = getPostBySlug(slug);
		if (post) {
			return json(post);
		} else {
			return json({ error: 'Post not found' }, { status: 404 });
		}
	} catch (error) {
		console.error('Error fetching post:', error);
		return json({ error: 'Failed to fetch post' }, { status: 500 });
	}
};
