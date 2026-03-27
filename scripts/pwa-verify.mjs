import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const failures = [];

function absolutePath(relativePath) {
	return path.join(root, relativePath);
}

function fileExists(relativePath) {
	return existsSync(absolutePath(relativePath));
}

function assertCondition(condition, message) {
	if (!condition) {
		failures.push(message);
	}
}

async function readText(relativePath) {
	return readFile(absolutePath(relativePath), 'utf8');
}

async function verifySourceFiles() {
	const requiredStaticIcons = [
		'static/pwa-192x192.png',
		'static/pwa-512x512.png',
		'static/pwa-512x512-maskable.png'
	];

	for (const iconPath of requiredStaticIcons) {
		assertCondition(fileExists(iconPath), `Missing required static icon: ${iconPath}`);
	}

	const appHtml = await readText('src/app.html');
	assertCondition(
		appHtml.includes('rel="manifest" href="/manifest.webmanifest"'),
		'Missing manifest link in src/app.html'
	);
	assertCondition(
		appHtml.includes('name="theme-color"'),
		'Missing theme-color meta tag in src/app.html'
	);

	const rootLayout = await readText('src/routes/+layout.svelte');
	assertCondition(
		rootLayout.includes("navigator.serviceWorker.register('/service-worker.js')"),
		'Missing service worker registration in src/routes/+layout.svelte'
	);

	const serviceWorkerSourcePath = 'src/service-worker.ts';
	assertCondition(
		fileExists(serviceWorkerSourcePath),
		`Missing source service worker: ${serviceWorkerSourcePath}`
	);
}

async function verifyBuildArtifacts() {
	const manifestPath = '.svelte-kit/output/client/manifest.webmanifest';
	const serviceWorkerPath = '.svelte-kit/output/client/service-worker.js';

	assertCondition(
		fileExists(manifestPath),
		`Missing build artifact: ${manifestPath} (run "pnpm run build" first)`
	);
	assertCondition(
		fileExists(serviceWorkerPath),
		`Missing build artifact: ${serviceWorkerPath} (run "pnpm run build" first)`
	);

	if (fileExists(manifestPath)) {
		const manifestText = await readText(manifestPath);
		let manifest;
		try {
			manifest = JSON.parse(manifestText);
		} catch {
			failures.push(`Invalid JSON in ${manifestPath}`);
			return;
		}

		assertCondition(
			manifest.display === 'standalone',
			'PWA manifest display should be "standalone"'
		);
		assertCondition(manifest.start_url === '/', 'PWA manifest start_url should be "/"');

		const icons = Array.isArray(manifest.icons) ? manifest.icons : [];
		const iconBySrc = new Map(icons.map((icon) => [icon.src, icon]));

		assertCondition(iconBySrc.has('/pwa-192x192.png'), 'manifest missing /pwa-192x192.png icon');
		assertCondition(iconBySrc.has('/pwa-512x512.png'), 'manifest missing /pwa-512x512.png icon');
		assertCondition(
			iconBySrc.has('/pwa-512x512-maskable.png'),
			'manifest missing /pwa-512x512-maskable.png icon'
		);

		const maskableIcon = iconBySrc.get('/pwa-512x512-maskable.png');
		assertCondition(
			typeof maskableIcon?.purpose === 'string' && maskableIcon.purpose.includes('maskable'),
			'maskable icon must include purpose "maskable"'
		);
	}

	if (fileExists(serviceWorkerPath)) {
		const serviceWorkerText = await readText(serviceWorkerPath);
		assertCondition(
			serviceWorkerText.includes('app-cache-') && serviceWorkerText.includes('addEventListener'),
			'Service worker bundle does not appear to include expected handlers'
		);
	}
}

async function main() {
	await verifySourceFiles();
	await verifyBuildArtifacts();

	if (failures.length > 0) {
		console.error('PWA verification failed:');
		for (const failure of failures) {
			console.error(`- ${failure}`);
		}
		process.exit(1);
	}

	console.log('PWA verification passed.');
}

main().catch((error) => {
	console.error('PWA verification crashed:', error);
	process.exit(1);
});
