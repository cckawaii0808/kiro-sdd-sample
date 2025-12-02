# 快速開始

開始使用 Kiro CLI 進行規格驅動開發。

## 1. 安裝 Kiro CLI

### 系統需求
- Node.js 18+ 或 Python 3.8+
- Git

### 安裝指令

```bash
# 使用 npm 安裝
npm install -g kiro-cli

# 驗證安裝
kiro-cli --version
```

## 2. 建立第一個專案

### 初始化專案結構

```bash
# 建立專案目錄
mkdir my-project
cd my-project

# 初始化 Git
git init

# 建立基本結構
mkdir -p .kiro/agents docs src tests
```

### 建立規格文件

在 `docs/spec.md` 建立你的第一個規格文件：

```markdown
# 專案規格

## 專案目標
[描述你的專案要解決的問題]

## 功能需求
- [ ] 功能 1
- [ ] 功能 2

## 技術架構
- 後端：Node.js
- 資料庫：PostgreSQL
```

## 3. 啟動 Kiro CLI

```bash
# 啟動 Kiro CLI
kiro-cli chat

# 或使用自訂 agent
kiro-cli chat --agent project-dev
```

## 4. 基本配置

### 啟用實驗性功能

在 Kiro CLI 中執行：

```
/experiment
```

建議啟用：
- ✓ Knowledge：索引規格文件
- ✓ TODO Lists：任務追蹤
- ✓ Checkpointing：程式碼變更追蹤

### 建立知識庫

```
/knowledge add --name docs --path docs/
/knowledge add --name specs --path specs/
```

## 5. 開始開發

現在你可以開始與 Kiro 對話：

```
> 根據 docs/spec.md 建立開發計畫
```

Kiro 會：
1. 讀取你的規格文件
2. 生成 TODO 清單
3. 協助你逐步實作

## 下一步

- 學習[核心概念](/docs/concepts/spec-driven-dev)
- 了解[完整工作流程](/docs/workflow)
- 查看[實際範例](/docs/examples/this-website)
