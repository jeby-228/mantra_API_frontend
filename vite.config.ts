import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { VitePWA } from 'vite-plugin-pwa';
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
		sveltekit(),
		VitePWA({
			injectRegister: null,
			registerType: 'autoUpdate',
			includeAssets: ['favicon.svg', 'robots.txt'],
			manifest: {
				name: 'Jeby Website',
				short_name: 'Jeby Website',
				description: 'Jeby Website built with SvelteKit',
				theme_color: '#0f172a',
				background_color: '#0f172a',
				display: 'standalone',
				scope: '/',
				start_url: '/',
				icons: [
					{
						src: '/pwa-192x192.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'any'
					},
					{
						src: '/pwa-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any'
					},
					{
						src: '/pwa-512x512-maskable.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable'
					}
				]
			},
			workbox: {
				// 對 SvelteKit（SSR/多頁）來說，把 navigateFallback 指到 /offline 會讓所有導覽都變成離線頁。
				// 這裡改回首頁作為 app shell；真正離線時的體驗建議用 injectManifest 自訂 catch handler 處理。
				navigateFallback: '/',
				navigateFallbackDenylist: [/^\/api\//, /^\/offline\/?$/],
				runtimeCaching: [
					{
						urlPattern: /\.(?:js|css)$/i,
						handler: 'StaleWhileRevalidate',
						options: {
							cacheName: 'assets-cache',
							expiration: {
								maxEntries: 128,
								maxAgeSeconds: 60 * 60 * 24 * 30
							}
						}
					},
					{
						urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif|ico)$/i,
						handler: 'StaleWhileRevalidate',
						options: {
							cacheName: 'images-cache',
							expiration: {
								maxEntries: 128,
								maxAgeSeconds: 60 * 60 * 24 * 30
							}
						}
					},
					{
						urlPattern: /\.(?:woff2|woff|ttf|otf)$/i,
						handler: 'StaleWhileRevalidate',
						options: {
							cacheName: 'fonts-cache',
							expiration: {
								maxEntries: 32,
								maxAgeSeconds: 60 * 60 * 24 * 30
							}
						}
					}
				]
			},
			devOptions: {
				// dev 也提供 manifest（避免 /manifest.webmanifest 404），但 SW 接管會被 +layout.svelte 在 dev 模式主動註銷
				enabled: true
			}
		})
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
