# AGENTS.md

本文件提供給自動化代理（AI coding agents）在此儲存庫工作的最小必要規範。

## 專案摘要

- 技術棧：Svelte 5、SvelteKit、TypeScript、Tailwind CSS、Skeleton UI
- 套件管理：`pnpm`
- 主要用途：前端網站（含 GraphQL codegen 與測試工具鏈）

## 環境需求

- Linux 或 macOS
- Node.js 20+
- pnpm
- just（建議）

## 啟動與常用指令

```bash
pnpm install
pnpm dev
pnpm build
pnpm preview
pnpm check
pnpm lint
pnpm test
pnpm graphql:codegen
```

## 環境變數

先複製範本後再填值：

```bash
cp .env.example .env
```

常見變數：

- `PUBLIC_GA4_MEASUREMENT_ID`
- `PUBLIC_GITHUB_REPO`

## 程式風格與設計原則

- 優先保持簡單，避免過度設計。
- 一個模組/函式盡量只做一件事。
- 優先可讀性與可維護性。
- 非必要不要新增自訂 CSS，優先使用既有 UI 框架能力。
- 註解應精簡，僅在程式碼不易直觀理解時補充。

## 開發流程建議（給代理）

1. 先閱讀 `README.md` 與 `docs/` 中相關文件。
2. 修改前先確認影響範圍，避免不必要的大規模重構。
3. 完成修改後至少執行：
   - `pnpm check`
   - `pnpm lint`
   - `pnpm test`
4. 只提交與任務直接相關的變更。
5. Commit message 使用清楚、具描述性的內容。

## GraphQL 注意事項

- 若變更了 GraphQL schema 或 query，請執行：

```bash
pnpm graphql:codegen
```

## 文件同步

若有新增開發指令、環境需求或工作流程，請同步更新：

- `README.md`
- `docs/` 內對應文件
- 本檔案 `AGENTS.md`
