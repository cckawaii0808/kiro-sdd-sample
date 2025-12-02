# Render 後端部署指南

本指南說明如何將後端 API 部署到 Render（免費方案）。

## 前置準備

1. 註冊 Render 帳號：https://render.com
2. 連接 GitHub 帳號

## 部署步驟

### 方法 1：使用 Blueprint（推薦）

1. **推送程式碼到 GitHub**
   ```bash
   git push origin main
   ```

2. **在 Render 建立新服務**
   - 進入 https://dashboard.render.com
   - 點擊 **New +** → **Blueprint**
   - 選擇你的 GitHub repo：`cckawaii0808/kiro-sdd-sample`
   - Render 會自動讀取 `render.yaml` 配置
   - 點擊 **Apply**

3. **等待部署完成**
   - 約 2-3 分鐘
   - 部署成功後會顯示網址

4. **取得 API 網址**
   ```
   https://kiro-sdd-sample-api.onrender.com
   ```

### 方法 2：手動建立（備選）

1. **建立 Web Service**
   - 點擊 **New +** → **Web Service**
   - 連接 GitHub repo
   - 設定如下：

2. **基本設定**
   ```
   Name: kiro-sdd-sample-api
   Region: Singapore
   Branch: main
   Root Directory: (留空)
   Runtime: Node
   ```

3. **建置設定**
   ```
   Build Command: cd backend && npm install && npm run build
   Start Command: cd backend && node dist/index.js
   ```

4. **環境變數**
   ```
   NODE_ENV=production
   PORT=10000
   JWT_SECRET=<自動生成或手動輸入>
   ```

5. **選擇方案**
   - 選擇 **Free**
   - 點擊 **Create Web Service**

## 更新前端 API 網址

部署完成後，更新前端配置：

### 1. 更新 project.config.json

```json
{
  "frontend": {
    "apiUrl": "https://kiro-sdd-sample-api.onrender.com"
  }
}
```

### 2. 更新前端元件

如果有硬編碼的 API 網址，改成：

```typescript
const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://kiro-sdd-sample-api.onrender.com'
  : 'http://localhost:3001';
```

### 3. 推送更新

```bash
git add .
git commit -m "Update API URL for production"
git push origin main
```

## Render 免費方案限制

### 優點
- ✅ 完全免費
- ✅ 自動 HTTPS
- ✅ 自動部署（推送即部署）
- ✅ 512MB RAM
- ✅ 100GB 流量/月

### 限制
- ⚠️ **15 分鐘無活動會休眠**
- ⚠️ **喚醒需要 30-60 秒**
- ⚠️ 共享 CPU
- ⚠️ 不適合生產環境

### 解決休眠問題

可以使用定時 ping 服務（不推薦，違反 ToS）：
```yaml
# 或接受休眠，在文件中說明
```

## 測試部署

### 1. 測試 Health Check

```bash
curl https://kiro-sdd-sample-api.onrender.com/health
```

應該回傳：
```json
{"status":"ok"}
```

### 2. 測試 API 文件

訪問：
```
https://kiro-sdd-sample-api.onrender.com/api-docs
```

### 3. 測試註冊 API

```bash
curl -X POST https://kiro-sdd-sample-api.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'
```

## CORS 設定

確保後端允許前端網域：

```typescript
// backend/src/index.ts
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://cckawaii0808.github.io'
  ]
}));
```

## 環境變數管理

### 在 Render Dashboard 設定

1. 進入你的服務
2. 點擊 **Environment**
3. 加入環境變數：
   - `JWT_SECRET`: 隨機字串（自動生成）
   - `NODE_ENV`: production
   - `DATABASE_URL`: （如果使用 PostgreSQL）

### 本地開發

使用 `.env` 檔案：
```bash
cp backend/.env.example backend/.env
# 編輯 .env 設定本地變數
```

## 監控和日誌

### 查看日誌

1. 進入 Render Dashboard
2. 選擇你的服務
3. 點擊 **Logs** 標籤

### 查看指標

- CPU 使用率
- 記憶體使用率
- 請求數量

## 自動部署

Render 會自動監聽 GitHub：
- 推送到 `main` 分支 → 自動部署
- 部署失敗 → 保持舊版本運行
- 可以在 Dashboard 手動回滾

## 升級到付費方案

如果需要更好的效能：

### Starter 方案（$7/月）
- 不會休眠
- 更多 RAM
- 更快的 CPU

### Standard 方案（$25/月）
- 生產環境等級
- 自動擴展
- 優先支援

## 疑難排解

### 部署失敗

1. 檢查 Render 日誌
2. 確認 `package.json` 的 scripts 正確
3. 確認 TypeScript 編譯成功

### API 無法訪問

1. 檢查 CORS 設定
2. 確認環境變數正確
3. 查看服務狀態

### 效能問題

1. 免費方案會休眠，首次請求較慢
2. 考慮升級到付費方案
3. 或使用其他平台（Railway、Fly.io）

## 替代方案

### Railway
- 每月 $5 免費額度
- 不會休眠
- 設定更簡單

### Fly.io
- 免費方案有限制
- 全球 CDN
- 較複雜的設定

### Vercel（Serverless）
- 需要改成 Serverless Functions
- 免費方案慷慨
- 冷啟動問題

## 相關連結

- [Render 文件](https://render.com/docs)
- [Node.js 部署指南](https://render.com/docs/deploy-node-express-app)
- [環境變數設定](https://render.com/docs/environment-variables)
