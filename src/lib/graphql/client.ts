import { createClient, cacheExchange, fetchExchange } from '@urql/svelte';
import { PUBLIC_GRAPHQL_ENDPOINT } from '$env/static/public';

/**
 * 建立 URQL GraphQL 客戶端
 *
 * 配置說明：
 * - url: GraphQL API 端點（從環境變數讀取）
 * - exchanges: 使用快取交換和取得交換
 * - requestPolicy: 預設使用 'cache-first' 策略
 */
export const graphqlClient = createClient({
	url: PUBLIC_GRAPHQL_ENDPOINT,
	exchanges: [cacheExchange, fetchExchange],
	requestPolicy: 'cache-first'
});
