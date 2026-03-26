import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
import { execSync } from 'child_process';

function getGitInfo() {
	try {
		const branch = execSync('git branch --show-current').toString().trim();
		const version = execSync('git describe --tags --always').toString().trim();
		const lastCommitTime = execSync('git log -1 --format=%ci').toString().trim();
		const isDirty = execSync('git status --porcelain').toString().trim().length > 0;
		const commitHash = execSync('git rev-parse HEAD').toString().trim();
		return { branch, version, lastCommitTime, isDirty, commitHash };
	} catch {
		return {
			branch: 'unknown',
			version: 'unknown',
			lastCommitTime: 'unknown',
			isDirty: false,
			commitHash: 'unknown'
		};
	}
}

const gitInfo = getGitInfo();

export default defineConfig({
	plugins: [
		tailwindcss(),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			includeAssets: ['favicon.svg', 'robots.txt'],
			manifest: {
				name: 'Jeby Website',
				short_name: 'Jeby',
				start_url: '/',
				scope: '/',
				display: 'standalone',
				background_color: '#ffffff',
				theme_color: '#0f172a',
				icons: [
					{
						src: '/pwa-192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/pwa-512.png',
						sizes: '512x512',
						type: 'image/png'
					},
					{
						src: '/pwa-maskable.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable'
					}
				]
			},
			workbox: {
				clientsClaim: true,
				skipWaiting: true,
				runtimeCaching: [
					{
						urlPattern: ({ url }) => url.origin === self.location.origin,
						handler: 'NetworkFirst',
						options: {
							cacheName: 'pages',
							networkTimeoutSeconds: 3
						}
					},
					{
						urlPattern: ({ request }) => request.destination === 'image',
						handler: 'CacheFirst',
						options: {
							cacheName: 'images',
							expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 }
						}
					}
				]
			},
			devOptions: {
				enabled: true
			}
		}),
		sveltekit()
	],
	define: {
		__GIT_BRANCH__: JSON.stringify(gitInfo.branch),
		__GIT_VERSION__: JSON.stringify(gitInfo.version),
		__GIT_LAST_COMMIT_TIME__: JSON.stringify(gitInfo.lastCommitTime),
		__IS_DIRTY__: JSON.stringify(gitInfo.isDirty),
		__COMMIT_HASH__: JSON.stringify(gitInfo.commitHash)
	},
	optimizeDeps: {
		include: ['@skeletonlabs/skeleton-svelte', '@lucide/svelte']
	},
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'client',
					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: 'chromium', headless: true }]
					},
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**']
				}
			},

			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
