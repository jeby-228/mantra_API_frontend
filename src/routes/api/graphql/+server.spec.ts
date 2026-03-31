import { afterEach, describe, expect, it, vi } from 'vitest';
import { env } from '$env/dynamic/public';
import { POST } from './+server';

const fetchMock = vi.fn<typeof fetch>();

vi.stubGlobal('fetch', fetchMock);

function createRequest(body: string): Request {
	return new Request('https://app.test/api/graphql', {
		method: 'POST',
		body
	});
}

function createEvent(overrides?: {
	token?: string | undefined;
	body?: string;
}): Parameters<typeof POST>[0] {
	const token = overrides?.token;

	return {
		request: createRequest(overrides?.body ?? '{"query":"{ me { id } }"}'),
		cookies: {
			get: vi.fn((name: string) => {
				if (name === 'token') return token;
				return undefined;
			})
		}
	} as unknown as Parameters<typeof POST>[0];
}

afterEach(() => {
	vi.clearAllMocks();
});

describe('/api/graphql POST', () => {
	it('forwards request body and bearer token when token exists', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response('{"data":{"me":{"id":"1"}}}', {
				status: 200,
				headers: { 'Content-Type': 'application/json' }
			})
		);

		const body = '{"query":"{ me { id } }"}';
		const event = createEvent({ token: 'abc123', body });
		const response = await POST(event);

		expect(fetchMock).toHaveBeenCalledTimes(1);
		expect(fetchMock).toHaveBeenCalledWith(`${env.PUBLIC_API_BASE_URL}/graphql`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer abc123'
			},
			body
		});
		expect(response.status).toBe(200);
		await expect(response.text()).resolves.toBe('{"data":{"me":{"id":"1"}}}');
		expect(response.headers.get('Content-Type')).toBe('application/json');
	});

	it('does not attach authorization header when token is absent', async () => {
		fetchMock.mockResolvedValueOnce(new Response('{"errors":[]}', { status: 400 }));

		const event = createEvent({ token: undefined, body: '{"query":"{}"}' });
		const response = await POST(event);

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [, init] = fetchMock.mock.calls[0] ?? [];
		expect(init?.headers).toEqual({
			'Content-Type': 'application/json'
		});
		expect(response.status).toBe(400);
		await expect(response.text()).resolves.toBe('{"errors":[]}');
	});

	it('preserves non-2xx upstream status and payload', async () => {
		fetchMock.mockResolvedValueOnce(
			new Response('{"error":"upstream unavailable"}', {
				status: 503,
				headers: { 'X-Trace-Id': 'trace-1' }
			})
		);

		const response = await POST(createEvent());

		expect(response.status).toBe(503);
		await expect(response.text()).resolves.toBe('{"error":"upstream unavailable"}');
		expect(response.headers.get('Content-Type')).toBe('application/json');
	});
});
