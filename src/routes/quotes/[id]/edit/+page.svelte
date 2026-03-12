<script lang="ts">
	import QuoteForm from '$lib/components/quotes/QuoteForm.svelte';
	import { getContextClient, queryStore } from '@urql/svelte';
	import {
		GetQuoteRecordDocument,
		UpdateQuoteRecordDocument,
		type UpdateQuoteRecordInput
	} from '$lib/graphql/generated';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { ArrowLeft, Loader2 } from 'lucide-svelte';

	const client = getContextClient();
	const id = $page.params.id;

	const quoteQuery = queryStore({
		client,
		query: GetQuoteRecordDocument,
		variables: { id }
	});

	let updateLoading = $state(false);
	let updateError = $state<string | null>(null);

	async function handleUpdate(input: UpdateQuoteRecordInput) {
		updateLoading = true;
		updateError = null;

		try {
			const result = await client.mutation(UpdateQuoteRecordDocument, { id, input }).toPromise();

			if (result.error) {
				updateError = result.error.message;
			} else {
				goto('/quotes');
			}
		} catch (err) {
			updateError = err instanceof Error ? err.message : 'Unknown error';
		} finally {
			updateLoading = false;
		}
	}

	function handleCancel() {
		goto('/quotes');
	}
</script>

<svelte:head>
	<title>編輯名言 - Mantra API</title>
</svelte:head>

<div class="container mx-auto max-w-4xl space-y-6 p-4">
	<div class="flex items-center gap-4">
		<button onclick={() => goto('/quotes')} class="btn-icon btn preset-tonal">
			<ArrowLeft class="size-5" />
		</button>
		<h1 class="text-surface-900-50 text-3xl font-bold">編輯名言</h1>
	</div>

	{#if $quoteQuery.fetching}
		<div class="flex items-center justify-center p-12">
			<Loader2 class="size-8 animate-spin text-primary-500" />
		</div>
	{:else if $quoteQuery.error}
		<div class="rounded-lg bg-error-500/10 p-4 text-error-500">
			<p class="font-medium">載入失敗</p>
			<p class="text-sm">{$quoteQuery.error.message}</p>
		</div>
	{:else if $quoteQuery.data?.quoteRecord}
		<QuoteForm
			onSubmit={handleUpdate}
			onCancel={handleCancel}
			loading={updateLoading}
			initialValues={{
				jb_name: $quoteQuery.data.quoteRecord.jb_name,
				quote: $quoteQuery.data.quoteRecord.quote,
				said_at: $quoteQuery.data.quoteRecord.said_at || undefined
			}}
		/>

		{#if updateError}
			<div class="rounded-lg bg-error-500/10 p-4 text-error-500">
				<p class="font-medium">更新失敗</p>
				<p class="text-sm">{updateError}</p>
			</div>
		{/if}
	{:else}
		<div class="rounded-lg bg-warning-500/10 p-4 text-warning-500">
			<p>找不到該名言記錄</p>
		</div>
	{/if}
</div>
