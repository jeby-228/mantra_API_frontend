<script lang="ts">
	import type { PageData } from './$types';
	import { AlertCircleIcon } from '@lucide/svelte';

	let { data }: { data: PageData } = $props();
</script>

<div class="container mx-auto flex h-full items-center justify-center p-4">
	{#if data.error}
		<div class="card p-6 variant-filled-error shadow-xl max-w-md text-center space-y-4">
			<div class="flex justify-center">
				<AlertCircleIcon class="size-12" />
			</div>
			<h3 class="h3 font-bold">Login Failed</h3>
			<p>{data.error}</p>
			<a href="/login" class="btn variant-filled-surface mt-4">Back to Login</a>
		</div>
	{:else}
		<div class="flex flex-col items-center space-y-4">
			<div class="placeholder-circle w-12 h-12 animate-pulse bg-surface-300-600-token"></div>
			<p>Logging you in...</p>
		</div>
	{/if}
</div>
