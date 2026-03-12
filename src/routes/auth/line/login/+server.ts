import { env } from '$env/dynamic/public';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const channelID = env.PUBLIC_LINE_CHANNEL_ID;
	const redirectURI = env.PUBLIC_LINE_REDIRECT_URI || 'http://localhost:5173/auth/line/callback';
	const mode = url.searchParams.get('mode') === 'bind' ? 'bind' : 'login';
	const returnTo = url.searchParams.get('return_to') || '/';
	const state = `${mode}.${encodeURIComponent(returnTo)}.${crypto.randomUUID()}`;

	if (!channelID) {
		return new Response('Missing PUBLIC_LINE_CHANNEL_ID', { status: 500 });
	}

	const params = new URLSearchParams({
		response_type: 'code',
		client_id: channelID,
		redirect_uri: redirectURI,
		state,
		scope: 'profile openid email'
	});

	throw redirect(302, `https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`);
};
