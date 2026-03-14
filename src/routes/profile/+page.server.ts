import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { env } from '$env/dynamic/public';

const LINE_UNBIND_ENDPOINT = `${env.PUBLIC_API_BASE_URL}/api/v1/auth/line/unbind`;

type UserWithLineHints = {
	line_bound?: boolean;
	lineBound?: boolean;
	line_user_id?: string | null;
	lineUserId?: string | null;
	line_id?: string | null;
};

function getLineBoundStatus(user: unknown, cookieValue: string | undefined): boolean | null {
	const lineUser = (user || {}) as UserWithLineHints;

	if (typeof lineUser.line_bound === 'boolean') return lineUser.line_bound;
	if (typeof lineUser.lineBound === 'boolean') return lineUser.lineBound;
	if (typeof lineUser.line_user_id === 'string') return lineUser.line_user_id.length > 0;
	if (typeof lineUser.lineUserId === 'string') return lineUser.lineUserId.length > 0;
	if (typeof lineUser.line_id === 'string') return lineUser.line_id.length > 0;

	if (cookieValue === '1') return true;
	if (cookieValue === '0') return false;

	return null;
}

export const load: PageServerLoad = async ({ locals, url, cookies }) => {
	if (!locals.user) {
		throw redirect(303, '/login');
	}

	const lineBoundFromCookie = cookies.get('line_bound');
	let lineBound = getLineBoundStatus(locals.user, lineBoundFromCookie);

	if (url.searchParams.get('line_status') === 'bound') {
		lineBound = true;
	}
	if (url.searchParams.get('line_status') === 'unbound') {
		lineBound = false;
	}

	return {
		user: locals.user,
		lineStatus: url.searchParams.get('line_status'),
		lineError: url.searchParams.get('line_error'),
		lineBound
	};
};

export const actions: Actions = {
	bindLine: async () => {
		throw redirect(303, '/auth/line/login?mode=bind&return_to=/profile');
	},
	unbindLine: async ({ locals, cookies }) => {
		if (!locals.token) {
			throw redirect(303, '/login');
		}

		try {
			const response = await fetch(LINE_UNBIND_ENDPOINT, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${locals.token}`
				}
			});

			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				return fail(response.status, { lineActionError: errorData.error || 'Unbind LINE failed' });
			}

			const result = await response.json().catch(() => ({}));
			if (result.user) {
				cookies.set('user', JSON.stringify(result.user), {
					path: '/',
					httpOnly: true,
					secure: import.meta.env.PROD,
					maxAge: 60 * 60 * 24 * 7
				});
			}

			cookies.set('line_bound', '0', {
				path: '/',
				httpOnly: true,
				secure: import.meta.env.PROD,
				maxAge: 60 * 60 * 24 * 7
			});

			return { lineActionSuccess: 'LINE account unbound successfully' };
		} catch (error) {
			console.error('LINE unbind error:', error);
			return fail(500, { lineActionError: 'An unexpected error occurred while unbinding LINE' });
		}
	}
};
