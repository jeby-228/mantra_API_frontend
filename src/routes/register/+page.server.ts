import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { env } from '$env/dynamic/public';

const API_BASE_URL = env.PUBLIC_API_BASE_URL;

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(303, '/');
	}
};

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const name = data.get('name');
		const email = data.get('email');
		const password = data.get('password');

		if (!name || !email || !password) {
			return fail(400, { error: 'All fields are required' });
		}

		try {
			const response = await fetch(`${API_BASE_URL}/api/v1/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ name, email, password })
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				return fail(response.status, { error: errorData.error || 'Registration failed' });
			}

			const result = await response.json();
			const { token, user } = result;

			// Set cookies
			cookies.set('token', token, {
				path: '/',
				httpOnly: true,
				secure: import.meta.env.PROD,
				maxAge: 60 * 60 * 24 * 7 // 1 week
			});

			cookies.set('user', JSON.stringify(user), {
				path: '/',
				httpOnly: true, // Also HttpOnly for security
				secure: import.meta.env.PROD,
				maxAge: 60 * 60 * 24 * 7
			});
		} catch (error) {
			console.error('Registration error:', error);
			return fail(500, { error: 'An unexpected error occurred' });
		}

		throw redirect(303, '/');
	}
};
