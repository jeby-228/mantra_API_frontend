import { env } from '$env/dynamic/public';
import type { RequestHandler } from '@sveltejs/kit';

const GRAPHQL_ENDPOINT = env.PUBLIC_GRAPHQL_ENDPOINT;

export const POST: RequestHandler = async ({ request }) => {
	const body = await request.text();
	const response = await fetch(GRAPHQL_ENDPOINT, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body
	});
	const data = await response.text();
	return new Response(data, {
		status: response.status,
		headers: { 'Content-Type': 'application/json' }
	});
};
