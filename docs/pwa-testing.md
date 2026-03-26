# PWA 測試清單

本文件分成兩部分：

1. **CI 自動檢查**（機器可執行）
2. **手動驗收**（裝置與瀏覽器實測）

---

## 1) CI 自動檢查

目前 `just ci` 會在 build 後額外執行：

```bash
pnpm run pwa:verify
```

此腳本會檢查：

- `src/app.html` 是否有 manifest 與 theme-color
- `src/routes/+layout.svelte` 是否有 `registerSW` 註冊
- `static/pwa-192x192.png`、`static/pwa-512x512.png`、`static/pwa-512x512-maskable.png` 是否存在
- build 後 `.svelte-kit/output/client/manifest.webmanifest` 是否存在且可解析
- manifest 內的 `display/start_url/icons` 是否符合預期
- build 後 `.svelte-kit/output/client/sw.js` 是否生成且包含 precache 內容
- build 後 offline route server entry 是否存在

---

## 2) 手動驗收（建議上線前）

### A. 安裝能力（Desktop + Android）

1. 開啟站台（HTTPS）
2. 確認可安裝（瀏覽器安裝按鈕或「加入主畫面」）
3. 安裝後確認：
   - 啟動畫面圖示清晰
   - app 名稱正確
   - 以 standalone 模式開啟

### B. 離線行為

1. 先正常開過首頁與常用頁面
2. 斷網後重開 app
3. 確認：
   - App shell 可開啟
   - 不會出現白屏
   - 需要網路的功能有合理提示（例如 offline 頁）

### C. 更新行為（Service Worker）

1. 部署新版本後重新開啟舊版頁面
2. 確認新版資源會被更新（必要時重整一次）
3. 不可出現長期卡舊版資源

### D. 認證與敏感資料

1. 登入後操作 API（含 mutation）
2. 清除登入或登出後再開 app
3. 確認：
   - 沒有錯誤重播舊的敏感回應
   - `/api/*` 不會被錯誤地離線快取成可重用內容

### E. iOS Safari（額外）

iOS PWA 行為與 Chrome 不同，建議至少檢查：

- 「加入主畫面」可用
- 圖示與名稱正確
- 從主畫面啟動後基本路由可用
- 斷網時不會白屏

---

## 常見故障快速排除

- 若 dev 模式遇到奇怪快取：先清掉 site data + service worker，再重開 dev server
- 若 `just ci` 的 test 階段缺瀏覽器：執行 `pnpm exec playwright install --with-deps chromium`
- 若 pwa:verify 失敗：先看錯誤訊息對應缺少的檔案或 manifest 欄位
