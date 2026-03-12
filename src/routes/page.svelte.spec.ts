import { cacheExchange, createClient, fetchExchange } from '@urql/svelte';
import { describe, expect, it } from 'vitest';
import { render } from 'vitest-browser-svelte';
import { page } from 'vitest/browser';
import Page from './+page.svelte';

const client = createClient({
	url: '/api/graphql',
	exchanges: [cacheExchange, fetchExchange]
});

function renderWithClient() {
	return render(Page, { context: new Map([['$$_urql', client]]) });
}

describe('/+page.svelte', () => {
	it('should render quote page heading', async () => {
		renderWithClient();

		const heading = page.getByRole('heading', { name: '名言語錄' });
		await expect.element(heading).toBeInTheDocument();
	});

	it('should render add button', async () => {
		renderWithClient();

		const addButton = page.getByRole('button', { name: /新增/ });
		await expect.element(addButton).toBeInTheDocument();
	});
});
