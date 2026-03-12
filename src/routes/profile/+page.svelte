<script lang="ts">
	import type { PageData } from './$types';
	import type { ActionData } from './$types';
	import { UserIcon } from '@lucide/svelte';

	let { data, form }: { data: PageData; form: ActionData } = $props();
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
			{#if data.lineStatus === 'bound'}
				<div class="alert variant-filled-success">LINE account bound successfully.</div>
			{/if}
			{#if data.lineError === 'bind_failed'}
				<div class="alert variant-filled-error">LINE bind failed. Please try again.</div>
			{/if}
			{#if form?.lineActionSuccess}
				<div class="alert variant-filled-success">{form.lineActionSuccess}</div>
			{/if}
			{#if form?.lineActionError}
				<div class="alert variant-filled-error">{form.lineActionError}</div>
			{/if}

			<div class="flex items-center space-x-4 p-4 rounded-container-token bg-surface-50-900-token">
				<div class="p-2 bg-primary-500/10 rounded-full text-primary-500">
					<UserIcon class="size-6" />
				</div>
				<div>
					<p class="text-sm text-surface-500 font-semibold uppercase tracking-wider">Name</p>
					<p class="text-lg">{user.name}</p>
				</div>
			</div>
			<div class="rounded-container-token border border-surface-500/30 p-4 space-y-3">
				<h3 class="h4 font-bold">LINE Account</h3>
				<div class="flex items-center justify-between gap-3">
					<p class="text-surface-500 text-sm">Current status</p>
					{#if data.lineBound === true}
						<span class="badge variant-filled-success">Bound</span>
					{:else if data.lineBound === false}
						<span class="badge variant-filled-warning">Not Bound</span>
					{:else}
						<span class="badge variant-filled-surface">Unknown</span>
					{/if}
				</div>
				<p class="text-surface-500 text-sm">Bind LINE for fast social login, or unbind to disconnect.</p>
				<div class="flex flex-wrap gap-3">
					{#if data.lineBound !== true}
						<form method="POST" action="?/bindLine">
							<button type="submit" class="btn" style="background-color: #06C755; color: white;">Bind LINE</button>
						</form>
					{/if}
					{#if data.lineBound !== false}
						<form method="POST" action="?/unbindLine">
							<button type="submit" class="btn variant-filled-error">Unbind LINE</button>
						</form>
					{/if}
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
