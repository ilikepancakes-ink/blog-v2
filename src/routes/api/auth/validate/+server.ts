import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async (event) => {
	const { request } = event;

	try {
		// Check HTTP Basic Auth
		const auth = request.headers.get('authorization');
		if (!auth || !auth.startsWith('Basic ')) {
			return json({ error: 'Unauthorized' }, { status: 401 });
		}

		const credentials = atob(auth.slice(6)).split(':');
		const [username, password] = credentials;

		if (username !== env.ADMIN_USER || password !== env.ADMIN_PASS) {
			return json({ error: 'Invalid credentials' }, { status: 401 });
		}

		return json({ success: true, user: username });
	} catch (error) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}
};
