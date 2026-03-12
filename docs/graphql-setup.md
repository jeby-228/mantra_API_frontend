# GraphQL 設定指南

本專案使用 URQL 作為 GraphQL 客戶端，並使用 GraphQL Code Generator 來自動產生型別。

## 專案結構

```
src/lib/graphql/
├── client.ts              # URQL 客戶端配置
├── queries/               # GraphQL 查詢
│   └── user.graphql       # 使用者相關查詢範例
├── mutations/             # GraphQL 變更操作
│   └── user.graphql       # 使用者相關變更操作範例
└── generated.ts           # 自動產生的型別（由 codegen 產生）

codegen.ts                 # GraphQL Code Generator 配置
```

## 環境設定

1. 複製 `.env.example` 為 `.env`：

```bash
cp .env.example .env
```

2. 設定 GraphQL API 端點：

```env
PUBLIC_GRAPHQL_ENDPOINT=https://member-api-0-0-4.onrender.com/graphql
```

## 安裝依賴

已安裝的 GraphQL 相關套件：

- `@urql/svelte` - Svelte 的 URQL 客戶端
- `graphql` - GraphQL 核心函式庫
- `@graphql-codegen/cli` - GraphQL Code Generator CLI
- `@graphql-codegen/typescript` - TypeScript 型別產生器
- `@graphql-codegen/typescript-operations` - GraphQL 操作型別產生器
- `@graphql-codegen/typescript-urql` - URQL 相關型別產生器

## 使用方式

### 1. 撰寫 GraphQL 操作

在 `src/lib/graphql/queries/` 或 `src/lib/graphql/mutations/` 目錄下建立 `.graphql` 檔案：

```graphql
# src/lib/graphql/queries/user.graphql
query GetUser($id: ID!) {
	user(id: $id) {
		id
		name
		email
	}
}
```

### 2. 產生型別

執行以下指令產生 TypeScript 型別：

```bash
pnpm graphql:codegen
```

或在開發時持續監聽變更：

```bash
pnpm graphql:watch
```

**注意**：執行程式碼產生前，請確保：

- GraphQL API 端點可連線
- 網路環境允許存取外部 API
- API 已啟用 introspection（內省功能）

### 3. 在 Svelte 元件中使用

```svelte
<script lang="ts">
	import { queryStore, getContextClient } from '@urql/svelte';
	import type { GetUserQuery, GetUserQueryVariables } from '$lib/graphql/generated';

	const client = getContextClient();

	const userQuery = queryStore({
		client,
		query: GetUserDocument,
		variables: { id: '1' }
	});
</script>

{#if $userQuery.fetching}
	<p>載入中...</p>
{:else if $userQuery.error}
	<p>錯誤：{$userQuery.error.message}</p>
{:else if $userQuery.data}
	<p>使用者：{$userQuery.data.user.name}</p>
{/if}
```

## GraphQL 客戶端配置

客戶端在 `src/lib/graphql/client.ts` 中配置，並在根布局 (`src/routes/+layout.svelte`) 中初始化。

### 快取策略

預設使用 `cache-first` 策略：

- 優先使用快取
- 快取不存在時才發送請求
- 適合靜態資料

可用的策略：

- `cache-first` - 優先快取
- `cache-and-network` - 使用快取但同時更新
- `network-only` - 只從網路取得
- `cache-only` - 只從快取取得

## 注意事項

1. **GraphQL Schema**: 範例查詢和變更操作已註解，請根據實際的 GraphQL schema 進行調整
2. **程式碼產生**: 每次修改 `.graphql` 檔案後，需要執行 `pnpm graphql:codegen` 重新產生型別
3. **環境變數**: GraphQL 端點必須以 `PUBLIC_` 開頭才能在客戶端使用
4. **型別安全**: 使用產生的型別可以獲得完整的 TypeScript 型別檢查
5. **網路存取**: 程式碼產生需要存取 GraphQL API，請確保網路環境允許

## 疑難排解

### 無法連線到 GraphQL 端點

如果執行 `pnpm graphql:codegen` 時出現連線錯誤：

1. 檢查 `.env` 檔案中的 `PUBLIC_GRAPHQL_ENDPOINT` 是否正確
2. 確認 API 服務是否正在運行
3. 檢查網路連線和防火牆設定
4. 確認 API 是否啟用 introspection

### Introspection 被禁用

某些 GraphQL API 可能在生產環境中禁用 introspection。解決方法：

1. 聯絡 API 維護者取得 schema 檔案
2. 將 schema 檔案放在專案中（例如 `schema.graphql`）
3. 更新 `codegen.ts` 中的 `schema` 路徑指向本地檔案

## 相關資源

- [URQL 文件](https://formidable.com/open-source/urql/docs/)
- [GraphQL Code Generator 文件](https://the-guild.dev/graphql/codegen)
- [GraphQL 官方文件](https://graphql.org/)
- [後端 API 專案](https://github.com/jeby-228/mantra_API)
