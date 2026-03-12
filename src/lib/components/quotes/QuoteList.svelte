<script lang="ts">
	import type { QuoteRecord } from '$lib/graphql/generated';
	import QuoteCard from './QuoteCard.svelte';
	import { Loader2 } from 'lucide-svelte';

	let {
		quotes = [],
		loading = false,
		error = null,
		onEdit,
		onDelete,
		onLoadMore
	} = $props<{
		quotes: QuoteRecord[];
		loading?: boolean;
		error?: string | null;
		onEdit?: (id: string) => void;
		onDelete?: (id: string) => void;
		onLoadMore?: () => void;
	}>();
</script>

<div class="space-y-4">
	{#if loading && quotes.length === 0}
		<div class="flex items-center justify-center p-12">
			<Loader2 class="size-8 animate-spin text-primary-500" />
		</div>
	{:else if error}
		<div class="rounded-lg bg-error-500/10 p-4 text-error-500">
			<p class="font-medium">載入失敗</p>
			<p class="text-sm">{error}</p>
		</div>
	{:else if quotes.length === 0}
		<div class="text-surface-600-300 flex items-center justify-center p-12">
			<p>目前沒有名言記錄</p>
		</div>
	{:else}
		{#each quotes as quote (quote.id)}
			<QuoteCard {quote} {onEdit} {onDelete} />
		{/each}

		{#if onLoadMore}
			<div class="flex justify-center pt-4">
				<button
					onclick={onLoadMore}
					disabled={loading}
					class="btn preset-filled-primary-500 btn-sm"
				>
					{#if loading}
						<Loader2 class="size-4 animate-spin" />
						載入中...
					{:else}
						載入更多
					{/if}
				</button>
			</div>
		{/if}
	{/if}
</div>
