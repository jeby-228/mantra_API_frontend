import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
	cookies.delete('token', { path: '/' });
	cookies.delete('user', { path: '/' });
	throw redirect(303, '/login');
};
