<script lang="ts">
	import type { CreateQuoteRecordInput } from '$lib/graphql/generated';
	import { Loader2 } from 'lucide-svelte';

	let {
		onSubmit,
		onCancel,
		loading = false,
		initialValues
	} = $props<{
		onSubmit: (input: CreateQuoteRecordInput) => void | Promise<void>;
		onCancel?: () => void;
		loading?: boolean;
		initialValues?: Partial<CreateQuoteRecordInput>;
	}>();

	let jb_name = $state(initialValues?.jb_name ?? '');
	let quote = $state(initialValues?.quote ?? '');
	let said_at = $state(initialValues?.said_at ?? '');

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		if (!jb_name.trim() || !quote.trim()) {
			return;
		}

		await onSubmit({
			jb_name: jb_name.trim(),
			quote: quote.trim(),
			said_at: said_at || null
		});
	}
</script>

<div class="card preset-tonal p-6">
	<form onsubmit={handleSubmit} class="space-y-4">
		<h2 class="text-surface-900-50 text-2xl font-bold">
			{initialValues ? '編輯名言' : '新增名言'}
		</h2>

		<div class="space-y-2">
			<label for="jb_name" class="text-surface-900-50 block text-sm font-medium">
				姓名 <span class="text-error-500">*</span>
			</label>
			<input
				id="jb_name"
				type="text"
				bind:value={jb_name}
				required
				disabled={loading}
				class="input"
				placeholder="請輸入姓名"
			/>
		</div>

		<div class="space-y-2">
			<label for="quote" class="text-surface-900-50 block text-sm font-medium">
				名言內容 <span class="text-error-500">*</span>
			</label>
			<textarea
				id="quote"
				bind:value={quote}
				required
				disabled={loading}
				rows="4"
				class="textarea"
				placeholder="請輸入名言內容"
			></textarea>
		</div>

		<div class="space-y-2">
			<label for="said_at" class="text-surface-900-50 block text-sm font-medium">
				說出日期（選填）
			</label>
			<input id="said_at" type="date" bind:value={said_at} disabled={loading} class="input" />
		</div>

		<div class="flex gap-2 border-t border-surface-500/20 pt-4">
			<button
				type="submit"
				disabled={loading || !jb_name.trim() || !quote.trim()}
				class="btn preset-filled-primary-500"
			>
				{#if loading}
					<Loader2 class="size-4 animate-spin" />
					處理中...
				{:else}
					{initialValues ? '更新' : '新增'}
				{/if}
			</button>

			{#if onCancel}
				<button type="button" onclick={onCancel} disabled={loading} class="btn preset-tonal">
					取消
				</button>
			{/if}
		</div>
	</form>
</div>
