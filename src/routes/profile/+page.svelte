<script lang="ts">
	import type { PageData } from './$types';
	import type { ActionData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
	const user = data.user!;
</script>

<div class="container mx-auto max-w-2xl p-4">
	<div class="space-y-6 card p-6 shadow-xl">
		<header class="flex items-center space-x-4 border-b border-surface-500/30 pb-6">
			<div
				class="bg-surface-200-700-token flex placeholder-circle h-20 w-20 items-center justify-center rounded-full text-3xl font-bold"
			>
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

			<div class="rounded-container-token space-y-3 border border-surface-500/30 p-4">
				<h3 class="h4 font-bold">LINE Account</h3>
				<div class="flex items-center justify-between gap-3">
					<p class="text-sm text-surface-500">Current status</p>
					{#if data.lineBound === true}
						<span class="variant-filled-success badge">Bound</span>
					{:else if data.lineBound === false}
						<span class="variant-filled-warning badge">Not Bound</span>
					{:else}
						<span class="variant-filled-surface badge">Unknown</span>
					{/if}
				</div>
				<p class="text-sm text-surface-500">
					Bind LINE for fast social login, or unbind to disconnect.
				</p>
				<div class="flex flex-wrap gap-3">
					{#if data.lineBound !== true}
						<form method="POST" action="?/bindLine">
							<button type="submit" class="btn" style="background-color: #06C755; color: white;"
								>Bind LINE</button
							>
						</form>
					{/if}
					{#if data.lineBound !== false}
						<form method="POST" action="?/unbindLine">
							<button type="submit" class="variant-filled-error btn">Unbind LINE</button>
						</form>
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
