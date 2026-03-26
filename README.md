## 環境需求

- linux OR macOS
- Node.js 20+
- pnpm
- just (recommended)

## 環境變數設定

專案使用以下環境變數：

- `PUBLIC_GA4_MEASUREMENT_ID`: Google Analytics 4 追蹤 ID（例如：`G-XXXXXXXXXX`）
- `PUBLIC_GITHUB_REPO`: GitHub 儲存庫 URL

複製 `.env.example` 為 `.env` 並填入對應的值：

```bash
cp .env.example .env
```

## 技術棧

- Svelte 5
- SvelteKit
- TypeScript

### 套件

- Tailwind CSS
- Skeleton

### 格式化工具

- Eslint
- Prettier

### 追蹤與分析工具

- Google Analytics 4 (GA4) - 網站行為與流量追蹤
- Vercel Speed Insights - 網站速度分析

## PWA 支援

- 透過 `@vite-pwa/sveltekit` 產生 manifest 與 service worker，瀏覽器會自動註冊並自動更新。
- PWA 圖示位於 `static/pwa-192.png`、`static/pwa-512.png`、`static/pwa-maskable.png`，可依品牌需求替換。

## gitflow

![GitFlow](gitflow.svg)

## 部屬策略

部屬依賴在 Vercel 平台上，採用自動化部屬策略。

![deployFlow](deploy.svg)
