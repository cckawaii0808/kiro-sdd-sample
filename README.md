# Kiro SDD Sample

Kiro CLI 規格驅動開發教學網站

## 專案結構

```
kiro-sdd-sample/
├── .kiro/
│   └── agents/          # Kiro CLI agent 配置
├── docs/                # 專案規格文件
│   ├── spec.md         # 規格文件
│   └── architecture.md # 架構文件
├── website/             # Docusaurus 教學網站
│   ├── docs/           # 教學文件
│   ├── src/            # React 元件（Demo）
│   └── static/         # 靜態資源
├── backend/             # Express API 後端
│   ├── src/            # 原始碼
│   ├── tests/          # 測試
│   └── prisma/         # Prisma schema
└── README.md
```

## 快速開始

### 1. 安裝依賴

```bash
# 安裝網站依賴
cd website
npm install

# 安裝後端依賴
cd ../backend
npm install
```

### 2. 啟動開發環境

**啟動教學網站**：
```bash
cd website
npm start
# 開啟 http://localhost:3000
```

**啟動後端 API**（如需測試 Demo）：
```bash
cd backend
npm run dev
# API 運行在 http://localhost:3001
```

### 3. 後端資料庫設定

本專案支援兩種資料庫方式：

#### 方式 1：記憶體資料庫（預設）
無需額外設定，適合 Demo 和開發測試。

#### 方式 2：Prisma + PostgreSQL（生產環境）
```bash
cd backend
cp .env.example .env
# 編輯 .env 設定 DATABASE_URL
npm run prisma:migrate
```

詳見 [backend/PRISMA_SETUP.md](backend/PRISMA_SETUP.md)

## 使用 Kiro CLI 開發

### 1. 啟動 Kiro CLI

```bash
cd /path/to/kiro-sdd-sample
kiro-cli chat --agent project-dev
```

### 2. 啟用實驗性功能

在 Kiro CLI 中執行：
```
/experiment
```
建議啟用：
- Knowledge：索引規格文件
- TODO Lists：任務追蹤
- Checkpointing：程式碼變更追蹤
- Thinking：顯示推理過程

### 3. 建立知識庫

```
/knowledge add docs/
/knowledge add website/docs/
```

### 4. 開始開發

```
> 根據 docs/spec.md 建立開發計畫
```

## 開發流程

1. **定義規格**：更新 `docs/spec.md`
2. **建立 TODO**：讓 Kiro 根據規格生成任務清單
3. **逐項開發**：按照 TODO 實作功能
4. **驗證規格**：確認實作符合規格
5. **建立檢查點**：使用 `/checkpoint` 追蹤變更
6. **保存對話**：使用 `/save` 保存開發過程

## Kiro CLI 常用命令

- `/experiment` - 管理實驗性功能
- `/knowledge add <path>` - 加入知識庫
- `/todos view` - 查看任務清單
- `/checkpoint list` - 查看檢查點
- `/checkpoint diff <tag1> <tag2>` - 比較變更
- `/save <name>` - 保存對話
- `/load` - 載入對話
- `Ctrl+T` - 進入/退出 Tangent Mode

## 規格文件

- [專案規格](docs/spec.md) - 功能需求、API 設計、資料模型
- [系統架構](docs/architecture.md) - 技術架構、模組設計

## 開發規範

- 所有功能必須符合 `docs/spec.md` 規格
- 程式碼變更前先建立 checkpoint
- 重要決策記錄在文件中
- 保持測試覆蓋率 > 80%

## 授權

[選擇適合的授權]
