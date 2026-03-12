<script lang="ts">
	import type { PageData } from './$types';
	import { AlertCircleIcon } from '@lucide/svelte';

	let { data }: { data: PageData } = $props();
</script>

<div class="container mx-auto flex h-full items-center justify-center p-4">
	{#if data.error}
		<div class="variant-filled-error max-w-md space-y-4 card p-6 text-center shadow-xl">
			<div class="flex justify-center">
				<AlertCircleIcon class="size-12" />
			</div>
			<h3 class="h3 font-bold">Login Failed</h3>
			<p>{data.error}</p>
			<a href="/login" class="variant-filled-surface mt-4 btn">Back to Login</a>
		</div>
	{:else}
		<div class="flex flex-col items-center space-y-4">
			<div class="bg-surface-300-600-token placeholder-circle h-12 w-12 animate-pulse"></div>
			<p>Logging you in...</p>
		</div>
	{/if}
</div>
