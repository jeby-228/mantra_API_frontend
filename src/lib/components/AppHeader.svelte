<script lang="ts">
	import { CircleUserIcon, MenuIcon, SearchIcon, LogOutIcon, LogInIcon } from '@lucide/svelte';
	import { AppBar } from '@skeletonlabs/skeleton-svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/stores';
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import SearchBar from '$lib/components/SearchBar.svelte';

	let {
		onMenuToggle,
		showSearch = $bindable(false),
		searchQuery = $bindable('')
	}: {
		onMenuToggle?: () => void;
		showSearch?: boolean;
		searchQuery?: string;
	} = $props();

	function handleSearchToggle() {
		showSearch = !showSearch;
		if (!showSearch) {
			searchQuery = '';
		}
	}
</script>

<AppBar>
	<AppBar.Toolbar class="grid-cols-[auto_1fr_auto]">
		<AppBar.Lead>
			<button
				type="button"
				class="btn-icon btn-icon-lg hover:preset-tonal"
				onclick={onMenuToggle}
				aria-label="切換選單"
			>
				<MenuIcon />
			</button>
		</AppBar.Lead>
		<AppBar.Headline>
			<a href={resolve('/')} class="text-2xl transition-opacity hover:opacity-80"> Jeby Website </a>
		</AppBar.Headline>
		<AppBar.Trail>
			<ThemeSwitcher />
			<button
				type="button"
				class="btn-icon hover:preset-tonal"
				onclick={handleSearchToggle}
				aria-label="搜尋"
			>
				<SearchIcon class="size-6" />
			</button>
			{#if $page.data.user}
				<a
					href={resolve('/profile' as '/')}
					class="btn-icon hover:preset-tonal"
					aria-label="使用者資料"
					title={$page.data.user.name}
				>
					<CircleUserIcon class="size-6" />
				</a>
				<form action="/logout" method="POST" class="inline-block">
					<button type="submit" class="btn-icon hover:preset-tonal" aria-label="登出">
						<LogOutIcon class="size-6" />
					</button>
				</form>
			{:else}
				<a href={resolve('/login' as '/')} class="btn-icon hover:preset-tonal" aria-label="登入">
					<LogInIcon class="size-6" />
				</a>
			{/if}
		</AppBar.Trail>
	</AppBar.Toolbar>
	<SearchBar bind:show={showSearch} bind:query={searchQuery} />
</AppBar>
