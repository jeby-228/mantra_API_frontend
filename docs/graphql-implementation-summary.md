# GraphQL 基礎設定完成總結

## 已完成的工作

### 1. 套件安裝

已安裝以下 GraphQL 相關套件：

**執行時期依賴**：
- `@urql/svelte` (v5.0.0) - Svelte 的 URQL GraphQL 客戶端
- `graphql` (v16.13.1) - GraphQL 核心函式庫

**開發依賴**：
- `@graphql-codegen/cli` (v6.1.3) - GraphQL 程式碼產生器 CLI
- `@graphql-codegen/typescript` (v5.0.9) - TypeScript 型別產生器
- `@graphql-codegen/typescript-operations` (v5.0.9) - GraphQL 操作型別產生器
- `@graphql-codegen/typescript-urql` (v5.0.0) - URQL 型別產生器

### 2. 專案結構

```
mantra_API_frontend/
├── .env.example                          # 環境變數範本（已加入 GraphQL 端點）
├── codegen.ts                            # GraphQL 程式碼產生器配置
├── package.json                          # 已加入 graphql:codegen 和 graphql:watch 腳本
├── docs/
│   └── graphql-setup.md                  # 完整的 GraphQL 設定指南
└── src/lib/graphql/
    ├── README.md                         # GraphQL 目錄說明
    ├── client.ts                         # URQL 客戶端配置
    ├── generated.ts                      # 型別定義檔（佔位）
    ├── queries/
    │   └── user.graphql                  # 查詢範例
    └── mutations/
        └── user.graphql                  # 變更操作範例
```

### 3. 環境配置

在 `.env.example` 中加入：
```env
PUBLIC_GRAPHQL_ENDPOINT=https://member-api-0-0-4.onrender.com/graphql
```

### 4. GraphQL 客戶端初始化

在 `src/routes/+layout.svelte` 中已初始化 URQL 客戶端：
- 使用 `setContextClient()` 設定全域客戶端
- 所有子元件都可以使用 `getContextClient()` 取得客戶端

### 5. 可用的 NPM 腳本

```bash
# 產生 GraphQL TypeScript 型別
pnpm graphql:codegen

# 監聽 .graphql 檔案變更並自動產生型別
pnpm graphql:watch
```

## 下一步操作

### 步驟 1：取得實際的 GraphQL Schema

由於 `https://member-api-0-0-4.onrender.com/graphql` 目前無法從本環境存取，您需要：

1. **方法一：使用 introspection（推薦）**
   ```bash
   # 在可以連線到 API 的環境執行
   pnpm graphql:codegen
   ```

2. **方法二：使用本地 schema 檔案**
   - 從後端專案取得 `schema.graphql` 檔案
   - 放在專案根目錄
   - 更新 `codegen.ts` 的 `schema` 設定：
     ```typescript
     schema: './schema.graphql'
     ```

### 步驟 2：撰寫實際的 GraphQL 操作

在 `src/lib/graphql/queries/` 或 `mutations/` 目錄中建立 `.graphql` 檔案：

```graphql
# 範例：src/lib/graphql/queries/member.graphql
query GetMember($id: ID!) {
  member(id: $id) {
    id
    name
    email
    createdAt
  }
}

query GetAllMembers {
  members {
    id
    name
    email
  }
}
```

### 步驟 3：產生 TypeScript 型別

```bash
pnpm graphql:codegen
```

這會在 `src/lib/graphql/generated.ts` 產生完整的型別定義。

### 步驟 4：在元件中使用

```svelte
<!-- src/routes/members/+page.svelte -->
<script lang="ts">
  import { queryStore, getContextClient } from '@urql/svelte';
  import { GetAllMembersDocument } from '$lib/graphql/generated';

  const client = getContextClient();
  const membersQuery = queryStore({
    client,
    query: GetAllMembersDocument
  });
</script>

{#if $membersQuery.fetching}
  <p>載入中...</p>
{:else if $membersQuery.error}
  <p>錯誤：{$membersQuery.error.message}</p>
{:else if $membersQuery.data}
  <ul>
    {#each $membersQuery.data.members as member}
      <li>{member.name} ({member.email})</li>
    {/each}
  </ul>
{/if}
```

## 設定說明

### URQL 客戶端配置（src/lib/graphql/client.ts）

```typescript
export const graphqlClient = createClient({
  url: PUBLIC_GRAPHQL_ENDPOINT,
  exchanges: [cacheExchange, fetchExchange],
  requestPolicy: 'cache-first'
});
```

- **url**: GraphQL API 端點（從環境變數讀取）
- **exchanges**: 使用快取交換和取得交換
- **requestPolicy**: 預設使用 'cache-first' 策略

### 程式碼產生配置（codegen.ts）

```typescript
const config: CodegenConfig = {
  schema: process.env.PUBLIC_GRAPHQL_ENDPOINT,
  documents: ['src/**/*.graphql', 'src/**/*.gql'],
  generates: {
    'src/lib/graphql/generated.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-urql']
    }
  }
};
```

## 注意事項

1. ✅ **型別安全**: 使用產生的型別可獲得完整的 TypeScript 型別檢查
2. ✅ **環境變數**: GraphQL 端點必須以 `PUBLIC_` 開頭才能在客戶端使用
3. ✅ **程式碼產生**: 每次修改 `.graphql` 檔案後需執行 `pnpm graphql:codegen`
4. ⚠️ **網路存取**: 程式碼產生需要存取 GraphQL API
5. ⚠️ **Schema 更新**: 後端 schema 更新時需重新執行程式碼產生

## 相關文件

- 完整設定指南：`docs/graphql-setup.md`
- GraphQL 目錄說明：`src/lib/graphql/README.md`
- 後端 API 專案：https://github.com/jeby-228/mantra_API

## 已通過的檢查

✅ TypeScript 型別檢查（`pnpm check`）
✅ ESLint 和 Prettier 檢查（`pnpm lint`）
✅ 所有檔案格式正確

## 專案狀態

目前專案已完成 GraphQL 基礎設定，但尚未實作商務邏輯。
範例檔案中的查詢和變更操作已註解，等待根據實際 schema 進行調整。
