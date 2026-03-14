import { env } from '$env/dynamic/public';
import { isRedirect, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

const API_BASE_URL = env.PUBLIC_API_BASE_URL;
const LINE_BIND_ENDPOINT = `${API_BASE_URL}/api/v1/auth/line/bind`;

type CallbackState = {
	mode?: 'login' | 'bind';
	return_to?: string;
};

function parseState(state: string | null): CallbackState {
	if (!state) {
		return { mode: 'login', return_to: '/' };
	}

	try {
		const [rawMode, rawReturnTo] = state.split('.', 3);
		return {
			mode: rawMode === 'bind' ? 'bind' : 'login',
			return_to: rawReturnTo ? decodeURIComponent(rawReturnTo) : '/'
		};
	} catch {
		return { mode: 'login', return_to: '/' };
	}
}

export const load: PageServerLoad = async ({ url, cookies }) => {
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const error = url.searchParams.get('error');
	const callbackState = parseState(state);

	if (error) {
		return { error: `LINE Login failed: ${error}` };
	}

	if (!code) {
		return { error: 'No code provided' };
	}

	// Exchange code for token via Backend API
	try {
		const redirectURI = env.PUBLIC_LINE_REDIRECT_URI || 'http://localhost:5173/auth/line/callback';
		const token = cookies.get('token');

		const endpoint =
			callbackState.mode === 'bind' ? LINE_BIND_ENDPOINT : `${API_BASE_URL}/api/v1/auth/line`;
		const headers: Record<string, string> = {
			'Content-Type': 'application/json'
		};

		if (callbackState.mode === 'bind') {
			if (!token) {
				throw redirect(303, '/login');
			}
			headers.Authorization = `Bearer ${token}`;
		}

		const response = await fetch(endpoint, {
			method: 'POST',
			headers,
			body: JSON.stringify({
				code,
				redirect_uri: redirectURI
			})
		});

		if (!response.ok) {
			console.error('Backend LINE callback failed:', response.status);
			if (callbackState.mode === 'bind') {
				throw redirect(303, '/profile?line_error=bind_failed');
			}
			return { error: 'Backend login failed. Please ensure the backend supports LINE Login.' };
		}

		const result = await response.json();
		const { token: nextToken, user } = result;

		if (nextToken) {
			cookies.set('token', nextToken, {
				path: '/',
				httpOnly: true,
				secure: import.meta.env.PROD,
				maxAge: 60 * 60 * 24 * 7
			});
		}

		if (user) {
			cookies.set('user', JSON.stringify(user), {
				path: '/',
				httpOnly: true,
				secure: import.meta.env.PROD,
				maxAge: 60 * 60 * 24 * 7
			});
		}

		// Persist latest LINE binding status for profile UI.
		cookies.set('line_bound', '1', {
			path: '/',
			httpOnly: true,
			secure: import.meta.env.PROD,
			maxAge: 60 * 60 * 24 * 7
		});

		if (callbackState.mode === 'bind') {
			throw redirect(303, '/profile?line_status=bound');
		}

		throw redirect(303, callbackState.return_to || '/');
	} catch (err) {
		if (isRedirect(err)) throw err;
		console.error('Callback error:', err);
		return { error: 'An unexpected error occurred during login.' };
	}
};
