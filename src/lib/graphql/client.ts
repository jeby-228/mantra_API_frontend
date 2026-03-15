import { cacheExchange, createClient, fetchExchange } from '@urql/svelte';

export const graphqlClient = createClient({
	url: '/graphql',
	exchanges: [cacheExchange, fetchExchange],
	requestPolicy: 'cache-first',
	preferGetMethod: false
});
