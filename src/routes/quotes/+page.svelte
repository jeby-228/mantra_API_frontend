<script lang="ts">
	import QuoteList from '$lib/components/quotes/QuoteList.svelte';
	import QuoteForm from '$lib/components/quotes/QuoteForm.svelte';
	import { getContextClient, queryStore } from '@urql/svelte';
	import {
		GetQuoteRecordsDocument,
		CreateQuoteRecordDocument,
		DeleteQuoteRecordDocument,
		type CreateQuoteRecordInput
	} from '$lib/graphql/generated';
	import { Plus } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	const client = getContextClient();

	let showForm = $state(false);
	let limit = 10;
	let offset = $state(0);

	let variables = $derived({ limit, offset });

	const quotesQuery = queryStore({
		client,
		query: GetQuoteRecordsDocument,
		variables
	});

	let createLoading = $state(false);
	let createError = $state<string | null>(null);
	let deleteLoading = $state(false);
	let deleteError = $state<string | null>(null);

	async function handleCreate(input: CreateQuoteRecordInput) {
		createLoading = true;
		createError = null;

		try {
			const result = await client.mutation(CreateQuoteRecordDocument, { input }).toPromise();

			if (result.error) {
				createError = result.error.message;
			} else {
				showForm = false;
				quotesQuery.reexecute({ requestPolicy: 'network-only' });
			}
		} catch (err) {
			createError = err instanceof Error ? err.message : 'Unknown error';
		} finally {
			createLoading = false;
		}
	}

	async function handleDelete(id: string) {
		if (!confirm('確定要刪除這條名言嗎？')) {
			return;
		}

		deleteLoading = true;
		deleteError = null;

		try {
			const result = await client.mutation(DeleteQuoteRecordDocument, { id }).toPromise();

			if (result.error) {
				deleteError = result.error.message;
			} else {
				quotesQuery.reexecute({ requestPolicy: 'network-only' });
			}
		} catch (err) {
			deleteError = err instanceof Error ? err.message : 'Unknown error';
		} finally {
			deleteLoading = false;
		}
	}

	function handleEdit(id: string) {
		goto(`/quotes/${id}/edit`);
	}

	function loadMore() {
		offset += limit;
	}
</script>

<svelte:head>
	<title>名言系統 - Mantra API</title>
</svelte:head>

<div class="container mx-auto max-w-4xl space-y-6 p-4">
	<div class="flex items-center justify-between">
		<h1 class="text-surface-900-50 text-3xl font-bold">名言系統</h1>
		<button onclick={() => (showForm = !showForm)} class="btn preset-filled-primary-500">
			<Plus class="size-5" />
			{showForm ? '取消新增' : '新增名言'}
		</button>
	</div>

	{#if showForm}
		<QuoteForm
			onSubmit={handleCreate}
			onCancel={() => (showForm = false)}
			loading={createLoading}
		/>
	{/if}

	{#if createError}
		<div class="rounded-lg bg-error-500/10 p-4 text-error-500">
			<p class="font-medium">新增失敗</p>
			<p class="text-sm">{createError}</p>
		</div>
	{/if}

	{#if deleteError}
		<div class="rounded-lg bg-error-500/10 p-4 text-error-500">
			<p class="font-medium">刪除失敗</p>
			<p class="text-sm">{deleteError}</p>
		</div>
	{/if}

	<QuoteList
		quotes={$quotesQuery.data?.quoteRecords.records || []}
		loading={$quotesQuery.fetching || deleteLoading}
		error={$quotesQuery.error?.message}
		onEdit={handleEdit}
		onDelete={handleDelete}
		onLoadMore={$quotesQuery.data?.quoteRecords.total &&
		$quotesQuery.data.quoteRecords.records.length < $quotesQuery.data.quoteRecords.total
			? loadMore
			: undefined}
	/>
</div>
