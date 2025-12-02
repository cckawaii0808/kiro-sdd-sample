# Agent 配置範例

學習如何配置專案專用的 Kiro CLI Agent。

## 什麼是 Agent？

Agent 是 Kiro CLI 的配置檔案，定義 AI 助手的行為和知識範圍。

## 基本配置

### 檔案位置

```
.kiro/agents/project-dev.json
```

### 最小配置

```json
{
  "name": "project-dev",
  "description": "專案開發 agent"
}
```

## 完整配置範例

### 1. 後端 API 專案

```json
{
  "name": "backend-api",
  "description": "後端 API 開發 agent",
  "instructions": [
    "遵循 docs/spec.md 的 API 規格",
    "使用 RESTful API 設計原則",
    "確保所有 API 都有錯誤處理",
    "撰寫單元測試覆蓋率 > 80%"
  ],
  "knowledge_paths": [
    "docs/",
    "specs/",
    "src/"
  ],
  "coding_style": {
    "language": "TypeScript",
    "framework": "Express",
    "linter": "ESLint",
    "formatter": "Prettier"
  }
}
```

### 2. 前端應用專案

```json
{
  "name": "frontend-app",
  "description": "前端應用開發 agent",
  "instructions": [
    "遵循 React 最佳實踐",
    "使用 TypeScript 嚴格模式",
    "元件必須有 PropTypes 或 TypeScript 型別",
    "確保無障礙性（a11y）"
  ],
  "knowledge_paths": [
    "docs/",
    "src/components/",
    "src/pages/"
  ],
  "coding_style": {
    "language": "TypeScript",
    "framework": "React",
    "styling": "Tailwind CSS"
  }
}
```

### 3. 全端專案

```json
{
  "name": "fullstack-dev",
  "description": "全端開發 agent",
  "instructions": [
    "前後端分離架構",
    "API 優先設計",
    "遵循 docs/spec.md 和 docs/architecture.md",
    "保持前後端資料模型一致"
  ],
  "knowledge_paths": [
    "docs/",
    "backend/",
    "frontend/",
    "shared/"
  ],
  "coding_style": {
    "backend": {
      "language": "Node.js",
      "framework": "Express"
    },
    "frontend": {
      "language": "TypeScript",
      "framework": "React"
    }
  }
}
```

## 配置選項說明

### name
Agent 的唯一識別名稱。

```json
"name": "my-agent"
```

### description
Agent 的簡短描述。

```json
"description": "專案開發 agent"
```

### instructions
給 AI 的具體指示，可以是字串或陣列。

```json
"instructions": [
  "遵循專案規格",
  "使用 TypeScript",
  "撰寫測試"
]
```

### knowledge_paths
要索引的目錄或檔案路徑。

```json
"knowledge_paths": [
  "docs/",
  "src/",
  "tests/"
]
```

### coding_style
程式碼風格偏好。

```json
"coding_style": {
  "language": "TypeScript",
  "framework": "React",
  "linter": "ESLint",
  "formatter": "Prettier"
}
```

## 使用 Agent

### 啟動指定 Agent

```bash
kiro-cli chat --agent project-dev
```

### 在對話中切換 Agent

```bash
/agent switch backend-api
```

### 查看當前 Agent

```bash
/agent info
```

## 實際案例

### 案例 1：本教學網站

`.kiro/agents/project-dev.json`：

```json
{
  "name": "project-dev",
  "description": "Kiro CLI 教學網站開發",
  "instructions": [
    "遵循 docs/spec.md 的網站規格",
    "使用 Docusaurus 3.x 框架",
    "內容以繁體中文撰寫",
    "確保文件清晰易懂"
  ],
  "knowledge_paths": [
    "docs/",
    "website/docs/",
    "website/src/"
  ],
  "coding_style": {
    "language": "TypeScript",
    "framework": "React",
    "styling": "CSS Modules"
  }
}
```

### 案例 2：用戶管理 API

`.kiro/agents/user-api.json`：

```json
{
  "name": "user-api",
  "description": "用戶管理 API 開發",
  "instructions": [
    "實作 RESTful API",
    "使用 JWT 認證",
    "密碼使用 bcrypt 加密",
    "所有端點都要有輸入驗證",
    "錯誤回應使用統一格式"
  ],
  "knowledge_paths": [
    "docs/api-spec.md",
    "src/",
    "tests/"
  ],
  "coding_style": {
    "language": "TypeScript",
    "framework": "Express",
    "database": "PostgreSQL",
    "orm": "Prisma"
  }
}
```

## 最佳實踐

### 1. 明確的指示
```json
// ❌ 不好
"instructions": "寫好程式碼"

// ✅ 好
"instructions": [
  "遵循 docs/spec.md 的 API 規格",
  "使用 TypeScript 嚴格模式",
  "撰寫單元測試"
]
```

### 2. 合理的知識範圍
```json
// ❌ 太廣
"knowledge_paths": ["/"]

// ✅ 精確
"knowledge_paths": [
  "docs/",
  "src/api/",
  "src/models/"
]
```

### 3. 專案特定的風格
```json
"coding_style": {
  "language": "TypeScript",
  "framework": "Express",
  "naming": {
    "files": "kebab-case",
    "classes": "PascalCase",
    "functions": "camelCase"
  }
}
```

### 4. 版本控制
將 agent 配置納入 Git：

```bash
git add .kiro/agents/
git commit -m "Add agent configuration"
```

## 進階技巧

### 多 Agent 協作

不同階段使用不同 Agent：

```bash
# 規劃階段
kiro-cli chat --agent architect

# 開發階段
kiro-cli chat --agent developer

# 測試階段
kiro-cli chat --agent tester
```

### 繼承配置

```json
{
  "name": "backend-api-v2",
  "extends": "backend-api",
  "instructions": [
    "額外支援 GraphQL"
  ]
}
```

### 環境變數

```json
{
  "name": "prod-deploy",
  "environment": {
    "NODE_ENV": "production",
    "API_URL": "${API_URL}"
  }
}
```

## 常見問題

**Q: Agent 配置會影響 AI 的能力嗎？**  
A: 不會。Agent 只是提供上下文和偏好，不會限制 AI 的能力。

**Q: 可以有多個 Agent 嗎？**  
A: 可以！不同專案或階段可以使用不同 Agent。

**Q: Agent 配置可以共享嗎？**  
A: 可以。將配置檔案加入 Git，團隊成員都能使用。

## 總結

Agent 配置讓 Kiro CLI 更貼近你的專案需求：
- ✅ 自訂開發規範
- ✅ 指定知識範圍
- ✅ 統一團隊風格
- ✅ 提高開發效率

開始建立你的專案 Agent 吧！
