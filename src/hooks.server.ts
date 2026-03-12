import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('token');
	const userStr = event.cookies.get('user');

	if (token && userStr) {
		try {
			const user = JSON.parse(userStr);
			event.locals.user = user;
			event.locals.token = token;
		} catch {
			// Invalid user cookie
			event.locals.user = null;
			event.locals.token = null;
		}
	} else {
		event.locals.user = null;
		event.locals.token = null;
	}

	const response = await resolve(event);
	return response;
};
