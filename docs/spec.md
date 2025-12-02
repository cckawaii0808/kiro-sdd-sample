# 專案規格文件

## 1. 專案概述

**專案名稱**：Kiro CLI 規格驅動開發教學網站  
**版本**：1.0.0  
**最後更新**：2025-12-02

### 1.1 專案目標
建立一個靜態網站，展示如何使用 Kiro CLI 進行規格驅動開發（Specification-Driven Development）。透過實際範例和互動式教學，幫助開發者：
- 理解規格驅動開發的概念和優勢
- 學習 Kiro CLI 的核心功能和工作流程
- 掌握從規格到實作的完整開發流程
- 建立可維護、可追蹤的開發習慣

### 1.2 目標用戶
- 軟體開發者（初級到中級）
- 專案管理者
- 對 AI 輔助開發工具感興趣的技術人員
- 想要改善開發流程的團隊

## 2. 功能需求

### 2.1 核心功能
- [ ] **首頁**：介紹規格驅動開發概念、Kiro CLI 特色、快速導覽
- [ ] **快速開始**：安裝指南、基本設定、第一個專案
- [ ] **核心概念**：規格文件、TODO 管理、知識庫、Checkpoint、Agent 配置
- [ ] **工作流程**：從規格到實作的完整流程展示
- [ ] **實際範例**：完整的專案範例（含程式碼和說明）
- [ ] **命令參考**：Kiro CLI 命令列表和使用說明

### 2.2 次要功能
- [ ] **互動式演示**：可執行的登入計算機 Demo
  - 用戶註冊和登入
  - JWT 認證
  - 計算機功能
  - 計算歷史記錄
- [ ] **最佳實踐**：開發建議和常見模式
- [ ] **FAQ**：常見問題解答
- [ ] **搜尋功能**：站內內容搜尋
- [ ] **深色模式**：支援淺色/深色主題切換

## 3. 技術架構

### 3.1 技術棧

#### 前端（教學網站）
- **框架**：Docusaurus 3.x
- **語言**：TypeScript
- **UI 庫**：React 18
- **樣式**：CSS Modules
- **部署**：GitHub Pages
- **版本控制**：Git + GitHub

#### 後端（Demo API）
- **語言**：TypeScript
- **框架**：Express.js
- **認證**：JWT
- **密碼加密**：bcrypt
- **測試**：Jest + Supertest
- **資料庫**：記憶體資料庫（示範用）
- **API 文件**：Swagger JSDoc + Scalar

#### API 文件規範
- **所有 API 端點必須加入 JSDoc 註解**
- **使用 `@openapi` 標籤定義 OpenAPI 規格**
- **註解必須包含**：
  - `tags`：API 分類
  - `summary`：簡短描述
  - `requestBody`：請求內容（POST/PUT）
  - `parameters`：路徑/查詢參數（GET/DELETE）
  - `responses`：所有可能的回應狀態碼
  - `security`：需要認證的端點必須標註
- **自動生成文件**：透過 swagger-jsdoc 掃描註解
- **文件展示**：使用 Scalar 在 `/api-docs` 提供互動式文件

#### 測試
- **後端測試**：Jest + Supertest
- **前端測試**：Jest + React Testing Library
- **測試覆蓋率**：> 80%

### 3.2 專案結構
```
my-project/
├── backend/              # 後端 API
│   ├── src/
│   │   ├── routes/      # API 路由（含 JSDoc 註解）
│   │   ├── models/      # 資料模型
│   │   ├── middleware/  # JWT 認證
│   │   ├── utils/       # 工具函數
│   │   ├── swagger.ts   # Swagger 配置
│   │   └── index.ts     # 主程式（含 /api-docs 路由）
│   └── tests/           # 後端測試
│
├── website/             # 前端教學網站
│   ├── docs/           # Markdown 文件
│   ├── src/
│   │   ├── components/ # React 元件
│   │   │   └── demo/  # Demo 元件
│   │   └── pages/     # 頁面
│   └── static/        # 靜態資源
│
└── docs/               # 專案文件
    ├── spec.md        # 本文件
    └── architecture.md # 架構文件
```

### 3.3 網站結構
```
/                    # 首頁
/getting-started     # 快速開始
/concepts            # 核心概念
  /spec-driven-dev   # 規格驅動開發
  /todo-management   # TODO 管理
  /knowledge-base    # 知識庫
  /checkpoints       # Checkpoint
  /agents            # Agent 配置
/workflow            # 工作流程
/examples            # 實際範例
  /user-api          # 範例：用戶 API
  /static-site       # 範例：靜態網站（本專案）
/commands            # 命令參考
/best-practices      # 最佳實踐
/faq                 # 常見問題
```

### 3.3 測試需求

#### 後端測試
- [ ] **單元測試**：每個工具函數都要有單元測試
- [ ] **API 測試**：每個 API 端點都要有整合測試
- [ ] **測試覆蓋率**：> 80%
- [ ] **測試框架**：Jest + Supertest
- [ ] **測試內容**：
  - 正常情況測試
  - 錯誤處理測試
  - 邊界情況測試
  - 認證和授權測試

#### 前端測試
- [ ] **元件測試**：每個 React 元件都要有測試
- [ ] **互動測試**：測試使用者互動行為
- [ ] **測試框架**：Jest + React Testing Library
- [ ] **測試內容**：
  - 元件渲染測試
  - 使用者事件測試
  - API 整合測試

#### 測試原則
- **TDD 優先**：先寫測試，再實作功能
- **自動化**：每個功能實作時同步建立測試
- **持續整合**：測試失敗時不允許合併程式碼
- **文件化**：測試即文件，清楚描述預期行為

## 4. 內容規格

### 4.1 首頁內容
- Hero Section：標題、副標題、CTA 按鈕
- 特色介紹：規格驅動開發的 3-4 個核心優勢
- 快速預覽：展示基本工作流程
- 開始使用：引導到快速開始頁面

### 4.2 快速開始頁面
```markdown
1. 安裝 Kiro CLI
   - 系統需求
   - 安裝指令
   - 驗證安裝

2. 建立第一個專案
   - 初始化專案結構
   - 建立規格文件
   - 啟動 Kiro CLI

3. 基本配置
   - 啟用實驗性功能
   - 建立知識庫
   - 配置 Agent

4. 第一個開發任務
   - 撰寫規格
   - 生成 TODO
   - 執行開發
```

### 4.3 核心概念頁面
每個概念包含：
- 概念說明（What）
- 使用原因（Why）
- 使用方法（How）
- 實際範例
- 相關命令

### 4.4 工作流程頁面
展示完整的開發循環：
```
1. 定義規格 (spec.md)
2. 建立知識庫 (/knowledge add)
3. 生成開發計畫 (TODO list)
4. 逐步實作
```

### 4.5 API 文件規範

#### 4.5.1 註解格式
所有 API 端點必須使用 JSDoc 註解定義 OpenAPI 規格：

```typescript
/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - 認證
 *     summary: 使用者登入
 *     description: 使用帳號密碼登入，取得 JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *               rememberMe:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: 登入成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: 認證失敗
 *       400:
 *         description: 請求錯誤
 */
router.post('/login', async (req, res) => {
  // 實作...
});
```

#### 4.5.2 必要欄位
每個 API 端點註解必須包含：
- **tags**：API 分類（認證、計算機等）
- **summary**：簡短描述（一句話）
- **description**：詳細說明（選用）
- **requestBody** 或 **parameters**：輸入定義
- **responses**：所有可能的 HTTP 狀態碼
- **security**：需要認證的端點必須標註 `bearerAuth`
- **example**：每個欄位提供範例值

#### 4.5.3 認證端點範例
```typescript
/**
 * @openapi
 * /api/protected:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     # ...
 */
```

#### 4.5.4 文件生成
- 使用 `swagger-jsdoc` 自動掃描 `src/routes/*.ts`
- 生成 OpenAPI 3.0 規格
- 透過 Scalar 在 `/api-docs` 提供互動式文件
- 支援線上測試和程式碼生成
5. 建立檢查點 (/checkpoint)
6. 驗證規格
7. 保存對話 (/save)
```

## 5. 範例專案

### 5.1 範例 1：用戶管理 API
展示如何使用 Kiro CLI 開發 RESTful API：
- 完整的規格文件
- 開發過程記錄
- 最終程式碼
- 測試結果

### 5.2 範例 2：本專案（Meta Example）
展示本網站的開發過程：
- 從想法到規格
- 技術選型過程
- 實際開發步驟
- 部署流程

## 6. 設計需求

### 6.1 視覺設計
- 簡潔現代的介面
- 清晰的資訊層級
- 易讀的字體和間距
- 響應式設計（支援手機、平板、桌面）

### 6.2 使用者體驗
- 直覺的導航結構
- 快速載入速度（< 2 秒）
- 程式碼區塊支援複製功能
- 清晰的視覺回饋

### 6.3 無障礙設計
- 符合 WCAG 2.1 AA 標準
- 鍵盤導航支援
- 螢幕閱讀器友善
- 適當的對比度

## 7. 效能需求

- 首次載入時間：< 2 秒
- 頁面切換：< 500ms
- 圖片優化：WebP 格式、Lazy loading
- 程式碼分割：按需載入
- SEO 優化：Meta tags、Sitemap、robots.txt

## 8. 部署需求

### 8.1 部署平台
- **主要選項**：GitHub Pages（免費、簡單）
- **備選**：Cloudflare Pages、Netlify

### 8.2 CI/CD 流程
```yaml
觸發條件：Push to main branch
步驟：
  1. 安裝依賴
  2. 建置靜態檔案
  3. 執行檢查（連結、格式）
  4. 部署到 GitHub Pages
```

### 8.3 自訂網域（可選）
- 設定 CNAME
- 配置 DNS
- 啟用 HTTPS

## 9. 內容維護

### 9.1 文件更新流程
- 使用 Markdown 撰寫
- Git 版本控制
- Pull Request 審查
- 自動部署

### 9.2 內容檢查清單
- [ ] 程式碼範例可執行
- [ ] 連結有效
- [ ] 截圖更新
- [ ] 版本資訊正確

## 10. 成功指標

### 10.1 技術指標
- Lighthouse Score > 90
- 無障礙評分 > 90
- 載入速度 < 2 秒

### 10.2 內容指標
- 涵蓋所有核心功能
- 至少 2 個完整範例
- 清晰的導航結構
