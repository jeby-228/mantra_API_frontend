<script lang="ts">
	import { getContextClient, queryStore } from '@urql/svelte';
	import { GetQuoteRecordsDocument, CreateQuoteRecordDocument } from '$lib/graphql/generated';
	import type { GetQuoteRecordsQuery } from '$lib/graphql/generated';

	const PAGE_SIZE = 10;
	let offset = $state(0);

	const client = getContextClient();

	const quotes = $derived(
		queryStore<GetQuoteRecordsQuery>({
			client,
			query: GetQuoteRecordsDocument,
			variables: { limit: PAGE_SIZE, offset }
		})
	);

	const records = $derived($quotes.data?.quoteRecords.records ?? []);
	const total = $derived($quotes.data?.quoteRecords.total ?? 0);
	const totalPages = $derived(Math.ceil(total / PAGE_SIZE));
	const currentPage = $derived(Math.floor(offset / PAGE_SIZE) + 1);

	// 新增表單
	let showForm = $state(false);
	let jbName = $state('');
	let quote = $state('');
	let saidAt = $state('');
	let createError = $state('');
	let submitting = $state(false);

	async function handleCreate(e: SubmitEvent) {
		e.preventDefault();
		createError = '';
		submitting = true;
		const result = await client
			.mutation(CreateQuoteRecordDocument, {
				input: {
					jb_name: jbName,
					quote,
					...(saidAt ? { said_at: new Date(saidAt).toISOString() } : {})
				}
			})
			.toPromise();
		submitting = false;
		if (result.error) {
			createError = result.error.message;
			return;
		}
		jbName = '';
		quote = '';
		saidAt = '';
		showForm = false;
		quotes.reexecute({ requestPolicy: 'network-only' });
	}
</script>

<div class="mx-auto max-w-3xl space-y-6 p-4">
	<header class="flex items-center justify-between">
		<div>
			<h1 class="h2">名言語錄</h1>
			{#if $quotes.data}
				<p class="text-sm text-surface-500">共 {total} 筆紀錄</p>
			{/if}
		</div>
		<button class="btn preset-filled" onclick={() => (showForm = !showForm)}>
			{showForm ? '取消' : '+ 新增'}
		</button>
	</header>

	{#if showForm}
		<form class="space-y-3 card p-4" onsubmit={handleCreate}>
			<h2 class="h4">新增名言</h2>
			<label class="label">
				<span class="label-text">說話者 *</span>
				<input class="input" type="text" bind:value={jbName} required placeholder="輸入名字" />
			</label>
			<label class="label">
				<span class="label-text">名言內容 *</span>
				<textarea class="textarea" bind:value={quote} required rows="3" placeholder="輸入名言..."
				></textarea>
			</label>
			<label class="label">
				<span class="label-text">說話日期</span>
				<input class="input" type="date" bind:value={saidAt} />
			</label>
			{#if createError}
				<p class="text-sm text-error-500">{createError}</p>
			{/if}
			<div class="flex justify-end gap-2">
				<button type="button" class="btn preset-tonal" onclick={() => (showForm = false)}
					>取消</button
				>
				<button type="submit" class="btn preset-filled" disabled={submitting}>
					{submitting ? '送出中...' : '送出'}
				</button>
			</div>
		</form>
	{/if}

	{#if $quotes.fetching}
		<div class="space-y-3">
			{#each Array(PAGE_SIZE) as _, i (i)}
				<div class="h-20 placeholder animate-pulse card"></div>
			{/each}
		</div>
	{:else if $quotes.error}
		<div class="alert variant-filled-error">
			<p>載入失敗：{$quotes.error.message}</p>
		</div>
	{:else if records.length === 0}
		<div class="card p-8 text-center">
			<p class="text-surface-400">目前沒有名言紀錄</p>
		</div>
	{:else}
		<ul class="space-y-3">
			{#each records as record (record.id)}
				<li class="space-y-1 card p-4">
					<blockquote class="text-base font-medium">「{record.quote}」</blockquote>
					<p class="text-sm text-surface-500">
						— {record.jb_name}
						{#if record.said_at}
							<span class="ml-2 opacity-60"
								>{new Date(record.said_at).toLocaleDateString('zh-TW')}</span
							>
						{/if}
					</p>
				</li>
			{/each}
		</ul>

		{#if totalPages > 1}
			<nav class="flex items-center justify-center gap-2">
				<button
					class="btn preset-tonal"
					disabled={offset === 0}
					onclick={() => (offset = Math.max(0, offset - PAGE_SIZE))}
				>
					上一頁
				</button>
				<span class="text-sm">{currentPage} / {totalPages}</span>
				<button
					class="btn preset-tonal"
					disabled={offset + PAGE_SIZE >= total}
					onclick={() => (offset += PAGE_SIZE)}
				>
					下一頁
				</button>
			</nav>
		{/if}
	{/if}
</div>
