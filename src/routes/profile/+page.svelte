<script lang="ts">
	import type { PageData } from './$types';
	import { UserIcon, MailIcon, HashIcon } from '@lucide/svelte';

	let { data }: { data: PageData } = $props();
	const user = data.user!;
</script>

<div class="container mx-auto p-4 max-w-2xl">
	<h1 class="h1 mb-8">User Profile</h1>

	<div class="card p-6 shadow-xl space-y-6">
		<header class="flex items-center space-x-4 border-b border-surface-500/30 pb-6">
			<div class="placeholder-circle w-20 h-20 bg-surface-200-700-token flex items-center justify-center text-3xl font-bold rounded-full">
				{user.name.charAt(0).toUpperCase()}
			</div>
			<div>
				<h2 class="h3 font-bold">{user.name}</h2>
				<p class="text-surface-500">Member</p>
			</div>
		</header>

		<div class="space-y-4">
			<div class="flex items-center space-x-4 p-4 rounded-container-token bg-surface-50-900-token">
				<div class="p-2 bg-primary-500/10 rounded-full text-primary-500">
					<UserIcon class="size-6" />
				</div>
				<div>
					<p class="text-sm text-surface-500 font-semibold uppercase tracking-wider">Name</p>
					<p class="text-lg">{user.name}</p>
				</div>
			</div>

			<div class="flex items-center space-x-4 p-4 rounded-container-token bg-surface-50-900-token">
				<div class="p-2 bg-primary-500/10 rounded-full text-primary-500">
					<MailIcon class="size-6" />
				</div>
				<div>
					<p class="text-sm text-surface-500 font-semibold uppercase tracking-wider">Email</p>
					<p class="text-lg">{user.email}</p>
				</div>
			</div>

			<div class="flex items-center space-x-4 p-4 rounded-container-token bg-surface-50-900-token">
				<div class="p-2 bg-primary-500/10 rounded-full text-primary-500">
					<HashIcon class="size-6" />
				</div>
				<div>
					<p class="text-sm text-surface-500 font-semibold uppercase tracking-wider">User ID</p>
					<p class="text-lg font-mono">#{user.id}</p>
				</div>
			</div>
		</div>

		<footer class="pt-6 border-t border-surface-500/30 flex justify-end">
			<form action="/logout" method="POST">
				<button type="submit" class="btn variant-filled-error">
					Log Out
				</button>
			</form>
		</footer>
	</div>
</div>
