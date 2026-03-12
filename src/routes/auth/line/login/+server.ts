import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { env } from '$env/dynamic/public';

export const GET: RequestHandler = async () => {
	const channelID = env.PUBLIC_LINE_CHANNEL_ID;
	const redirectURI = env.PUBLIC_LINE_REDIRECT_URI || 'http://localhost:5173/auth/line/callback';
	const state = crypto.randomUUID(); // In a real app, store this in a cookie to verify later

	if (!channelID) {
		return new Response('Missing PUBLIC_LINE_CHANNEL_ID', { status: 500 });
	}

	const params = new URLSearchParams({
		response_type: 'code',
		client_id: channelID,
		redirect_uri: redirectURI,
		state: state,
		scope: 'profile openid email'
	});

	throw redirect(302, `https://access.line.me/oauth2/v2.1/authorize?${params.toString()}`);
};
