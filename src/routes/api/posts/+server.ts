import { json, type RequestHandler } from '@sveltejs/kit';
import { getAllPosts, createPost, type Post } from '$lib/db';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async () => {
	try {
		const posts = getAllPosts();
		return json(posts);
	} catch (error) {
		console.error('Error fetching posts:', error);
		return json({ error: 'Failed to fetch posts' }, { status: 500 });
	}
};

export const POST: RequestHandler = async (event) => {
	const { request } = event;
	try {
		// Check HTTP Basic Auth
		const auth = request.headers.get('authorization');
		if (!auth || !auth.startsWith('Basic ')) {
			return json({ error: 'Unauthorized' }, {
				status: 401,
				headers: {
					'WWW-Authenticate': 'Basic realm="Admin Area"'
				}
			});
		}

		try {
			const credentials = atob(auth.slice(6)).split(':');
			const [username, password] = credentials;

			if (username !== env.ADMIN_USER || password !== env.ADMIN_PASS) {
				return json({ error: 'Unauthorized: Invalid credentials' }, {
					status: 401,
					headers: {
						'WWW-Authenticate': 'Basic realm="Admin Area"'
					}
				});
			}
		} catch (error) {
			return json({ error: 'Unauthorized' }, {
				status: 401,
				headers: {
					'WWW-Authenticate': 'Basic realm="Admin Area"'
				}
			});
		}

		const body = await request.json();
		const { title, excerpt, content } = body;

		if (!title || !excerpt || !content) {
			return json({ error: 'Missing required fields' }, { status: 400 });
		}

		// Generate slug from title
		const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

		// Check if slug already exists
		const existingPosts = getAllPosts();
		if (existingPosts.some(p => p.slug === slug)) {
			return json({ error: 'Post with this title already exists' }, { status: 409 });
		}

		const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

		const newPost = createPost({
			slug,
			title,
			date,
			excerpt,
			content
		});

		return json(newPost, { status: 201 });
	} catch (error) {
		console.error('Error creating post:', error);
		return json({ error: 'Failed to create post' }, { status: 500 });
	}
};
