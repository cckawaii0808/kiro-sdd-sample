# 系統架構文件

## 1. 系統概覽

### 1.1 架構圖
```
┌─────────────────┐
│   使用者瀏覽器   │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌─────────┐ ┌──────────────┐
│ 教學網站 │ │  Demo 頁面    │
│(靜態)   │ │  (前端)      │
└─────────┘ └──────┬───────┘
                   │ API 呼叫
                   ▼
            ┌──────────────┐
            │  後端 API     │
            │  (Express)   │
            └──────┬───────┘
                   │
                   ▼
            ┌──────────────┐
            │  記憶體資料庫 │
            └──────────────┘
```

### 1.2 專案結構
```
my-project/
├── backend/              # 後端 API
│   ├── src/
│   │   ├── routes/      # API 路由
│   │   ├── models/      # 資料模型
│   │   ├── middleware/  # JWT 認證等
│   │   └── utils/       # 工具函數
│   └── tests/           # 後端測試
│
├── website/             # 前端教學網站
│   ├── docs/           # Markdown 文件
│   ├── src/
│   │   ├── components/ # React 元件
│   │   │   └── demo/  # Demo 元件（登入、計算機）
│   │   └── pages/     # 頁面
│   └── static/        # 靜態資源
│
└── docs/               # 專案文件
    ├── spec.md        # 規格文件
    └── architecture.md # 本文件
```

## 2. 技術選型

### 2.1 前端框架
- **框架**：Docusaurus 3.x
- **語言**：TypeScript
- **UI 庫**：React 18
- **理由**：
  - React 生態系統成熟
  - 專為文件網站設計
  - 內建搜尋、版本控制、國際化
  - 優秀的 SEO 和效能
  - MDX 支援（Markdown + React 元件）

### 2.2 後端框架
- **語言**：TypeScript
- **框架**：Express.js
- **認證**：JWT (jsonwebtoken)
- **密碼加密**：bcrypt
- **驗證**：express-validator
- **測試**：Jest + Supertest
- **資料庫**：記憶體資料庫（示範用，生產環境建議使用 PostgreSQL + Prisma）
- **理由**：
  - TypeScript 提供型別安全
  - Express 成熟穩定
  - JWT 無狀態認證
  - 完整的測試覆蓋

### 2.3 樣式方案
- **CSS 框架**：CSS Modules
- **主題**：Docusaurus 內建主題 + 自訂樣式
- **圖示**：React Icons

### 2.4 部署平台
- **前端託管**：GitHub Pages
- **後端部署**：本地開發（示範用）
- **CI/CD**：GitHub Actions
- **網域**：github.io（可自訂）
- **理由**：
  - 免費且穩定
  - 與 GitHub 整合良好
  - 自動 HTTPS
  - 全球 CDN

## 3. 專案結構

### 3.1 目錄結構
```
my-project/
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions 部署配置
├── docs/                   # 專案文件（規格、架構）
├── website/                # Docusaurus 網站
│   ├── blog/              # 部落格文章（可選）
│   ├── docs/              # 文件內容
│   │   ├── getting-started.md
│   │   ├── concepts/
│   │   ├── workflow.md
│   │   ├── examples/
│   │   └── commands.md
│   ├── src/
│   │   ├── components/    # React 元件
│   │   ├── css/          # 自訂樣式
│   │   └── pages/        # 自訂頁面
│   ├── static/           # 靜態資源（圖片、檔案）
│   ├── docusaurus.config.js  # 主配置
│   ├── sidebars.js       # 側邊欄配置
│   └── package.json
└── README.md
```

### 3.2 內容組織
- **docs/**：教學文件（Markdown/MDX）
- **src/components/**：可重用的 React 元件
- **src/pages/**：獨立頁面（首頁、關於）
- **static/**：圖片、範例檔案

## 4. 建置與部署

### 4.1 開發流程
```bash
# 安裝依賴
npm install

# 本地開發（熱重載）
npm start

# 建置生產版本
npm run build

# 預覽建置結果
npm run serve
```

### 4.2 CI/CD 流程
```yaml
觸發：Push to main branch
步驟：
  1. Checkout 程式碼
  2. 設定 Node.js 環境
  3. 安裝依賴 (npm ci)
  4. 建置靜態檔案 (npm run build)
  5. 部署到 GitHub Pages
```

### 4.3 部署配置
- **分支**：gh-pages（自動建立）
- **路徑**：/（根目錄）
- **CNAME**：可選自訂網域

## 5. 功能特性

### 5.1 核心功能
- **文件導航**：側邊欄、麵包屑、上下頁
- **搜尋**：Algolia DocSearch（免費）
- **程式碼高亮**：Prism.js
- **深色模式**：自動切換
- **響應式設計**：手機、平板、桌面

### 5.2 互動元件
- **程式碼區塊**：複製按鈕、語法高亮
- **標籤頁**：多語言範例切換
- **警告框**：提示、注意、警告
- **可摺疊區塊**：詳細說明

## 6. 效能優化

### 6.1 建置優化
- **程式碼分割**：按路由自動分割
- **Tree Shaking**：移除未使用程式碼
- **壓縮**：HTML/CSS/JS 最小化
- **圖片優化**：WebP、Lazy loading

### 6.2 載入優化
- **預載入**：關鍵資源優先
- **快取策略**：Service Worker
- **CDN**：GitHub Pages 全球節點

### 6.3 SEO 優化
- **Meta Tags**：每頁自訂
- **Sitemap**：自動生成
- **robots.txt**：搜尋引擎配置
- **結構化資料**：Schema.org

## 7. 開發工具

### 7.1 程式碼品質
- **Linter**：ESLint
- **格式化**：Prettier
- **型別檢查**：TypeScript

### 7.2 版本控制
- **Git**：版本管理
- **GitHub**：程式碼託管
- **分支策略**：main（生產）、develop（開發）

## 8. 維護與更新

### 8.1 內容更新
- 編輯 Markdown 檔案
- 提交到 Git
- 自動觸發部署

### 8.2 版本管理
- Docusaurus 版本功能
- 保留舊版文件
- 版本切換器

### 8.3 監控
- **分析**：Google Analytics（可選）
- **錯誤追蹤**：瀏覽器 Console
- **效能**：Lighthouse CI
