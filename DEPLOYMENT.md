# 部署指南

本專案使用 GitHub Actions 自動部署到 GitHub Pages。

## 自動部署流程

當你推送到 `main` 分支時，會自動執行：

1. **測試後端**：執行 `backend` 的所有測試
2. **建置網站**：打包 `website` 成靜態檔案
3. **部署**：發布到 GitHub Pages

## 首次設定

### 1. 啟用 GitHub Pages

在 GitHub 專案設定中：
1. 進入 **Settings** → **Pages**
2. **Source** 選擇 `gh-pages` 分支
3. 點擊 **Save**

### 2. 設定 Docusaurus Base URL

編輯 `website/docusaurus.config.ts`：

```typescript
const config: Config = {
  // ...
  url: 'https://<你的GitHub帳號>.github.io',
  baseUrl: '/<專案名稱>/',
  // ...
};
```

例如：
- 專案：`https://github.com/cckawaii0808/kiro-sdd-sample`
- 網址：`https://cckawaii0808.github.io/kiro-sdd-sample/`

```typescript
url: 'https://cckawaii0808.github.io',
baseUrl: '/kiro-sdd-sample/',
```

### 3. 推送到 GitHub

```bash
git add .
git commit -m "Add GitHub Actions deployment"
git push origin main
```

### 4. 查看部署狀態

1. 進入 GitHub 專案的 **Actions** 頁面
2. 查看 "Deploy to GitHub Pages" 工作流程
3. 等待部署完成（約 2-3 分鐘）

### 5. 訪問網站

部署完成後，訪問：
```
https://<你的GitHub帳號>.github.io/<專案名稱>/
```

## 工作流程說明

### 觸發條件
- **Push to main**：自動測試 + 部署
- **Pull Request**：只執行測試，不部署

### 測試階段
```yaml
test-backend:
  - 安裝後端依賴
  - 執行測試（含覆蓋率）
  - 測試失敗會阻止部署
```

### 部署階段
```yaml
deploy:
  - 需要測試通過
  - 只在 main 分支執行
  - 建置靜態網站
  - 發布到 gh-pages 分支
```

## 本地測試

### 測試後端
```bash
cd backend
npm test
```

### 預覽網站
```bash
cd website
npm start
# 開啟 http://localhost:3000
```

### 建置網站
```bash
cd website
npm run build
npm run serve
# 開啟 http://localhost:3000
```

## 自訂網域（選用）

### 1. 設定 CNAME

在 `website/static/` 建立 `CNAME` 檔案：
```
www.yourdomain.com
```

### 2. 設定 DNS

在你的網域提供商設定：
```
Type: CNAME
Name: www
Value: <你的GitHub帳號>.github.io
```

### 3. 更新 Docusaurus 配置

```typescript
url: 'https://www.yourdomain.com',
baseUrl: '/',
```

## 疑難排解

### 部署失敗

1. 檢查 Actions 日誌
2. 確認測試通過
3. 確認 `baseUrl` 設定正確

### 404 錯誤

1. 確認 GitHub Pages 已啟用
2. 確認 `gh-pages` 分支存在
3. 確認 `baseUrl` 與專案名稱一致

### CSS/JS 載入失敗

檢查 `docusaurus.config.ts` 的 `url` 和 `baseUrl` 設定。

## 進階配置

### 加入前端測試

編輯 `.github/workflows/deploy.yml`，加入：

```yaml
test-frontend:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-node@v4
      with:
        node-version: '18'
    - name: Test Frontend
      run: |
        cd website
        npm ci
        npm test
```

### 部署到其他平台

#### Cloudflare Pages
1. 連接 GitHub 專案
2. 建置命令：`cd website && npm run build`
3. 輸出目錄：`website/build`

#### Netlify
1. 連接 GitHub 專案
2. 建置命令：`cd website && npm run build`
3. 發布目錄：`website/build`

## 相關連結

- [GitHub Pages 文件](https://docs.github.com/pages)
- [GitHub Actions 文件](https://docs.github.com/actions)
- [Docusaurus 部署指南](https://docusaurus.io/docs/deployment)
