import { env } from '$env/dynamic/public';
import type { RequestHandler } from '@sveltejs/kit';

const GRAPHQL_ENDPOINT = env.PUBLIC_GRAPHQL_ENDPOINT;

export const POST: RequestHandler = async ({ request, cookies }) => {
	const body = await request.text();
	const token = cookies.get('token');
	
	const headers: Record<string, string> = {
		'Content-Type': 'application/json'
	};
	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	const response = await fetch(GRAPHQL_ENDPOINT, {
		method: 'POST',
		headers,
		body
	});
	const data = await response.text();
	return new Response(data, {
		status: response.status,
		headers: { 'Content-Type': 'application/json' }
	});
};
