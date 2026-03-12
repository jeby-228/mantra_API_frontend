import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { env } from '$env/dynamic/public';

const API_BASE_URL = (env.PUBLIC_GRAPHQL_ENDPOINT || 'https://member-api-0-0-4.onrender.com/graphql').replace(/\/graphql$/, '');

export const load: PageServerLoad = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const error = url.searchParams.get('error');

	if (error) {
		return { error: `LINE Login failed: ${error}` };
	}

	if (!code) {
		return { error: 'No code provided' };
	}

	// Exchange code for token via Backend API
	try {
		const redirectURI = env.PUBLIC_LINE_REDIRECT_URI || 'http://localhost:5173/auth/line/callback';
		
		const response = await fetch(`${API_BASE_URL}/api/v1/auth/line`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ 
				code, 
				redirect_uri: redirectURI 
			})
		});

		if (!response.ok) {
			console.error('Backend LINE login failed:', response.status);
			return { error: 'Backend login failed. Please ensure the backend supports LINE Login.' };
		}

		const result = await response.json();
		const { token, user } = result;

		// Set cookies (Same as normal login)
		cookies.set('token', token, {
			path: '/',
			httpOnly: true,
			secure: import.meta.env.PROD,
			maxAge: 60 * 60 * 24 * 7
		});

		cookies.set('user', JSON.stringify(user), {
			path: '/',
			httpOnly: true,
			secure: import.meta.env.PROD,
			maxAge: 60 * 60 * 24 * 7
		});

		throw redirect(303, '/');

	} catch (err) {
		if (err instanceof Response) throw err; // Handle redirect
		console.error('Callback error:', err);
		return { error: 'An unexpected error occurred during login.' };
	}
};
