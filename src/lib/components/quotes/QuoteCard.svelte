<script lang="ts">
	import type { QuoteRecord } from '$lib/graphql/generated';
	import { Quote, Calendar, User } from 'lucide-svelte';

	let { quote, onEdit, onDelete } = $props<{
		quote: QuoteRecord;
		onEdit?: (id: string) => void;
		onDelete?: (id: string) => void;
	}>();

	function formatDate(dateStr: string | null | undefined): string {
		if (!dateStr) return '未知日期';
		try {
			return new Date(dateStr).toLocaleDateString('zh-TW', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			});
		} catch {
			return dateStr;
		}
	}
</script>

<div class="card preset-tonal p-6">
	<div class="space-y-4">
		<div class="flex items-start gap-3">
			<div class="rounded-full bg-primary-500/10 p-2">
				<Quote class="size-5 text-primary-500" />
			</div>
			<div class="flex-1">
				<blockquote class="text-surface-900-50 text-lg font-medium italic">
					"{quote.quote}"
				</blockquote>
			</div>
		</div>

		<div class="text-surface-600-300 flex items-center gap-4 text-sm">
			<div class="flex items-center gap-1">
				<User class="size-4" />
				<span>{quote.jb_name}</span>
			</div>
			{#if quote.said_at}
				<div class="flex items-center gap-1">
					<Calendar class="size-4" />
					<span>{formatDate(quote.said_at)}</span>
				</div>
			{/if}
		</div>

		{#if onEdit || onDelete}
			<div class="flex gap-2 border-t border-surface-500/20 pt-4">
				{#if onEdit}
					<button onclick={() => onEdit?.(quote.id)} class="btn preset-filled-primary-500 btn-sm">
						編輯
					</button>
				{/if}
				{#if onDelete}
					<button onclick={() => onDelete?.(quote.id)} class="btn preset-filled-error-500 btn-sm">
						刪除
					</button>
				{/if}
			</div>
		{/if}
	</div>
</div>
