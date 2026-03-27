/// <reference lib="webworker" />
import { build, files, version } from '$service-worker';

declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = `app-cache-${version}`;
const ASSETS_TO_CACHE = [...build, ...files];

self.addEventListener('install', (event) => {
	event.waitUntil(
		(async () => {
			const cache = await caches.open(CACHE_NAME);
			await cache.addAll(ASSETS_TO_CACHE);
			await self.skipWaiting();
		})()
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			const keys = await caches.keys();
			await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
			await self.clients.claim();
		})()
	);
});

self.addEventListener('fetch', (event) => {
	const { request } = event;
	if (request.method !== 'GET') return;

	const url = new URL(request.url);
	if (url.origin !== self.location.origin) return;
	if (url.pathname.startsWith('/api/')) return;

	event.respondWith(
		(async () => {
			const cached = await caches.match(request);
			if (cached) return cached;

			try {
				const response = await fetch(request);
				if (response.ok && request.destination !== '') {
					const cache = await caches.open(CACHE_NAME);
					await cache.put(request, response.clone());
				}
				return response;
			} catch {
				if (request.mode === 'navigate') {
					return (await caches.match('/')) ?? new Response('Offline', { status: 503 });
				}
				throw new TypeError('Network error and no cache available');
			}
		})()
	);
});
