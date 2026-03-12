# GraphQL 目錄說明

此目錄包含專案的 GraphQL 相關配置和操作。

## 檔案結構

- `client.ts` - URQL 客戶端初始化配置
- `queries/` - GraphQL 查詢操作目錄
- `mutations/` - GraphQL 變更操作目錄
- `generated.ts` - 自動產生的 TypeScript 型別（請勿手動編輯）

## 快速開始

1. 在 `queries/` 或 `mutations/` 目錄下建立 `.graphql` 檔案
2. 執行 `pnpm graphql:codegen` 產生型別
3. 在元件中匯入產生的型別和操作

詳細說明請參考：[GraphQL 設定指南](../../docs/graphql-setup.md)
