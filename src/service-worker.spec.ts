import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('$service-worker', () => ({
	build: ['/build/entry.js'],
	files: ['/favicon.png'],
	version: 'test-version'
}));

type ServiceWorkerListener = (event: unknown) => void;

async function loadServiceWorker(options?: {
	cacheMatchResult?: Response | undefined;
	rootFallbackResult?: Response | undefined;
	cacheKeys?: string[];
	fetchImplementation?: (request: unknown) => Promise<Response>;
}) {
	const listeners = new Map<string, ServiceWorkerListener>();
	const cache = {
		addAll: vi.fn().mockResolvedValue(undefined),
		put: vi.fn().mockResolvedValue(undefined)
	};

	const cachesMock = {
		open: vi.fn().mockResolvedValue(cache),
		keys: vi.fn().mockResolvedValue(options?.cacheKeys ?? []),
		delete: vi.fn().mockResolvedValue(true),
		match: vi.fn((request: unknown) => {
			if (request === '/') return Promise.resolve(options?.rootFallbackResult);
			return Promise.resolve(options?.cacheMatchResult);
		})
	};

	const selfMock = {
		location: { origin: 'https://app.test' },
		skipWaiting: vi.fn().mockResolvedValue(undefined),
		clients: {
			claim: vi.fn().mockResolvedValue(undefined)
		},
		addEventListener: vi.fn((type: string, callback: ServiceWorkerListener) => {
			listeners.set(type, callback);
		})
	};

	vi.stubGlobal('caches', cachesMock);
	vi.stubGlobal('self', selfMock);
	vi.stubGlobal(
		'fetch',
		vi.fn(
			options?.fetchImplementation ?? (() => Promise.resolve(new Response('ok', { status: 200 })))
		)
	);

	await import('./service-worker');

	return {
		listeners,
		cache,
		cachesMock,
		selfMock,
		fetchMock: vi.mocked(fetch)
	};
}

function getListener(
	listeners: Map<string, ServiceWorkerListener>,
	type: string
): ServiceWorkerListener {
	const handler = listeners.get(type);
	if (!handler) {
		throw new Error(`Expected ${type} listener to be registered`);
	}
	return handler;
}

describe('service-worker', () => {
	beforeEach(() => {
		vi.resetModules();
		vi.unstubAllGlobals();
		vi.clearAllMocks();
	});

	it('caches static assets and skips waiting on install', async () => {
		const { listeners, cachesMock, cache, selfMock } = await loadServiceWorker();
		const installHandler = getListener(listeners, 'install');
		expect(installHandler).toBeTypeOf('function');

		let waitUntilPromise: Promise<unknown> | undefined;
		installHandler({
			waitUntil: (promise: Promise<unknown>) => {
				waitUntilPromise = promise;
			}
		});

		await waitUntilPromise;
		expect(cachesMock.open).toHaveBeenCalledWith('app-cache-test-version');
		expect(cache.addAll).toHaveBeenCalledWith(['/build/entry.js', '/favicon.png']);
		expect(selfMock.skipWaiting).toHaveBeenCalledTimes(1);
	});

	it('deletes stale caches and claims clients on activate', async () => {
		const { listeners, cachesMock, selfMock } = await loadServiceWorker({
			cacheKeys: ['app-cache-old', 'app-cache-test-version', 'another-old']
		});
		const activateHandler = getListener(listeners, 'activate');
		expect(activateHandler).toBeTypeOf('function');

		let waitUntilPromise: Promise<unknown> | undefined;
		activateHandler({
			waitUntil: (promise: Promise<unknown>) => {
				waitUntilPromise = promise;
			}
		});

		await waitUntilPromise;
		expect(cachesMock.delete).toHaveBeenCalledWith('app-cache-old');
		expect(cachesMock.delete).toHaveBeenCalledWith('another-old');
		expect(cachesMock.delete).not.toHaveBeenCalledWith('app-cache-test-version');
		expect(selfMock.clients.claim).toHaveBeenCalledTimes(1);
	});

	it('returns early for non-cacheable fetch requests', async () => {
		const { listeners, fetchMock } = await loadServiceWorker();
		const fetchHandler = getListener(listeners, 'fetch');
		expect(fetchHandler).toBeTypeOf('function');

		const respondWith = vi.fn();
		fetchHandler({
			request: { method: 'POST', url: 'https://app.test/form', destination: '', mode: 'cors' },
			respondWith
		});
		fetchHandler({
			request: {
				method: 'GET',
				url: 'https://other.test/image.png',
				destination: 'image',
				mode: 'cors'
			},
			respondWith
		});
		fetchHandler({
			request: { method: 'GET', url: 'https://app.test/api/me', destination: '', mode: 'cors' },
			respondWith
		});

		expect(respondWith).not.toHaveBeenCalled();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('serves cached response before network', async () => {
		const cachedResponse = new Response('from-cache', { status: 200 });
		const { listeners, cachesMock, fetchMock } = await loadServiceWorker({
			cacheMatchResult: cachedResponse
		});
		const fetchHandler = getListener(listeners, 'fetch');

		let responsePromise: Promise<Response> | undefined;
		fetchHandler({
			request: {
				method: 'GET',
				url: 'https://app.test/image.png',
				destination: 'image',
				mode: 'cors'
			},
			respondWith: (promise: Promise<Response>) => {
				responsePromise = promise;
			}
		});

		if (!responsePromise) {
			throw new Error('respondWith should be called for cacheable requests');
		}
		const response = await responsePromise;
		expect(cachesMock.match).toHaveBeenCalledTimes(1);
		expect(fetchMock).not.toHaveBeenCalled();
		expect(response).toBe(cachedResponse);
	});

	it('caches successful asset responses from network', async () => {
		const { listeners, cachesMock, cache } = await loadServiceWorker({
			fetchImplementation: () => Promise.resolve(new Response('network-ok', { status: 200 }))
		});
		const fetchHandler = getListener(listeners, 'fetch');
		const request = {
			method: 'GET',
			url: 'https://app.test/assets/logo.png',
			destination: 'image',
			mode: 'cors'
		};

		let responsePromise: Promise<Response> | undefined;
		fetchHandler({
			request,
			respondWith: (promise: Promise<Response>) => {
				responsePromise = promise;
			}
		});

		if (!responsePromise) {
			throw new Error('respondWith should be called for cacheable requests');
		}
		const response = await responsePromise;
		expect(response.ok).toBe(true);
		expect(cachesMock.open).toHaveBeenCalledWith('app-cache-test-version');
		expect(cache.put).toHaveBeenCalledTimes(1);
		expect(cache.put).toHaveBeenCalledWith(request, expect.any(Response));
	});

	it('falls back to root cache for offline navigations', async () => {
		const rootResponse = new Response('<html>cached-root</html>', { status: 200 });
		const { listeners } = await loadServiceWorker({
			rootFallbackResult: rootResponse,
			fetchImplementation: () => Promise.reject(new Error('network down'))
		});
		const fetchHandler = getListener(listeners, 'fetch');

		let responsePromise: Promise<Response> | undefined;
		fetchHandler({
			request: {
				method: 'GET',
				url: 'https://app.test/profile',
				destination: 'document',
				mode: 'navigate'
			},
			respondWith: (promise: Promise<Response>) => {
				responsePromise = promise;
			}
		});

		if (!responsePromise) {
			throw new Error('respondWith should be called for navigation requests');
		}
		const response = await responsePromise;
		expect(response).toBe(rootResponse);
	});

	it('returns offline 503 when no root cache exists', async () => {
		const { listeners } = await loadServiceWorker({
			rootFallbackResult: undefined,
			fetchImplementation: () => Promise.reject(new Error('network down'))
		});
		const fetchHandler = getListener(listeners, 'fetch');

		let responsePromise: Promise<Response> | undefined;
		fetchHandler({
			request: {
				method: 'GET',
				url: 'https://app.test/profile',
				destination: 'document',
				mode: 'navigate'
			},
			respondWith: (promise: Promise<Response>) => {
				responsePromise = promise;
			}
		});

		if (!responsePromise) {
			throw new Error('respondWith should be called for navigation requests');
		}
		const response = await responsePromise;
		expect(response.status).toBe(503);
		await expect(response.text()).resolves.toBe('Offline');
	});

	it('throws for offline non-navigation requests', async () => {
		const { listeners } = await loadServiceWorker({
			fetchImplementation: () => Promise.reject(new Error('network down'))
		});
		const fetchHandler = getListener(listeners, 'fetch');

		let responsePromise: Promise<Response> | undefined;
		fetchHandler({
			request: {
				method: 'GET',
				url: 'https://app.test/assets/logo.png',
				destination: 'image',
				mode: 'cors'
			},
			respondWith: (promise: Promise<Response>) => {
				responsePromise = promise;
			}
		});

		if (!responsePromise) {
			throw new Error('respondWith should be called for cacheable requests');
		}
		await expect(responsePromise).rejects.toThrowError(
			new TypeError('Network error and no cache available')
		);
	});
});
