# 命令參考

Kiro CLI 常用命令完整參考。

## 基本命令

### 啟動 Kiro CLI

```bash
# 使用預設 agent
kiro-cli chat

# 使用指定 agent
kiro-cli chat --agent project-dev

# 查看版本
kiro-cli --version

# 查看幫助
kiro-cli --help
```

## 實驗性功能

### /experiment

管理實驗性功能。

```bash
# 查看可用功能
/experiment

# 啟用功能
/experiment enable knowledge
/experiment enable todos
/experiment enable checkpointing
```

**建議啟用**：
- Knowledge：知識庫索引
- TODO Lists：任務追蹤
- Checkpointing：程式碼變更追蹤
- Thinking：顯示推理過程

## 知識庫命令

### /knowledge add

加入檔案或目錄到知識庫。

```bash
# 基本用法
/knowledge add --name docs --path docs/

# 指定檔案類型
/knowledge add --name src --path src/ --include **/*.ts

# 排除特定目錄
/knowledge add --name project --path . --exclude node_modules/**
```

**參數**：
- `--name`：知識庫名稱
- `--path`：檔案或目錄路徑
- `--include`：包含的檔案模式
- `--exclude`：排除的檔案模式

### /knowledge show

顯示所有知識庫。

```bash
/knowledge show
```

### /knowledge search

搜尋知識庫內容。

```bash
/knowledge search "用戶認證"
```

### /knowledge remove

移除知識庫。

```bash
/knowledge remove --name docs
```

## TODO 命令

### 查看 TODO

```bash
# 查看當前 TODO 清單
/todos view

# 查看所有 TODO
/todos list
```

### 建立 TODO

在對話中請求 Kiro 建立：

```
> 根據 spec.md 建立開發計畫
```

### 標記完成

Kiro 會在任務完成時自動標記。

## Checkpoint 命令

### /checkpoint create

建立檢查點。

```bash
/checkpoint create "完成用戶註冊功能"
```

### /checkpoint list

列出所有檢查點。

```bash
/checkpoint list
```

### /checkpoint diff

比較兩個檢查點的差異。

```bash
/checkpoint diff v1 v2
```

### /checkpoint restore

恢復到指定檢查點。

```bash
/checkpoint restore v1
```

## 對話管理

### /save

保存當前對話。

```bash
/save "用戶管理 API 開發"
```

### /load

載入之前的對話。

```bash
# 顯示可載入的對話
/load

# 載入指定對話
/load <conversation-id>
```

### /clear

清除當前對話歷史。

```bash
/clear
```

## Agent 命令

### /agent info

顯示當前 agent 資訊。

```bash
/agent info
```

### /agent switch

切換到其他 agent。

```bash
/agent switch backend-api
```

### /agent list

列出所有可用 agent。

```bash
/agent list
```

## 特殊模式

### Tangent Mode

處理臨時問題時使用。

```bash
# 進入 Tangent Mode
Ctrl+T

# 提問
> 如何在 Express 中處理檔案上傳？

# 退出 Tangent Mode
Ctrl+T
```

**用途**：
- 快速查詢
- 臨時問題
- 不影響主要任務

## 系統命令

### /quit

退出 Kiro CLI。

```bash
/quit
```

### /help

顯示幫助資訊。

```bash
/help
```

### /context

顯示當前上下文資訊。

```bash
/context
```

## 實際使用範例

### 完整開發流程

```bash
# 1. 啟動 Kiro CLI
kiro-cli chat --agent project-dev

# 2. 啟用功能
/experiment enable knowledge
/experiment enable todos
/experiment enable checkpointing

# 3. 建立知識庫
/knowledge add --name docs --path docs/
/knowledge add --name src --path src/

# 4. 生成開發計畫
> 根據 docs/spec.md 建立開發計畫

# 5. 開始開發
> 開始實作第一個任務

# 6. 建立檢查點
/checkpoint create "完成基礎架構"

# 7. 繼續開發...

# 8. 保存對話
/save "專案初始化"

# 9. 退出
/quit
```

### 知識庫管理

```bash
# 索引專案文件
/knowledge add --name docs --path docs/

# 索引原始碼（只包含 TypeScript）
/knowledge add --name src --path src/ --include **/*.ts

# 索引測試（排除 node_modules）
/knowledge add --name tests --path tests/ --exclude node_modules/**

# 查看所有知識庫
/knowledge show

# 搜尋內容
/knowledge search "API 設計"

# 移除知識庫
/knowledge remove --name old-docs
```

### 檢查點管理

```bash
# 建立檢查點
/checkpoint create "完成用戶註冊"
/checkpoint create "完成用戶登入"
/checkpoint create "完成權限管理"

# 查看所有檢查點
/checkpoint list

# 比較變更
/checkpoint diff "完成用戶註冊" "完成用戶登入"

# 恢復到之前的狀態
/checkpoint restore "完成用戶註冊"
```

## 快捷鍵

| 快捷鍵 | 功能 |
|--------|------|
| `Ctrl+T` | 進入/退出 Tangent Mode |
| `Ctrl+C` | 中斷當前操作 |
| `Ctrl+D` | 退出 Kiro CLI |
| `↑` / `↓` | 瀏覽命令歷史 |

## 命令別名

某些命令有簡短別名：

```bash
/k add    # = /knowledge add
/k show   # = /knowledge show
/cp       # = /checkpoint
/t        # = /todos
```

## 提示與技巧

### 1. 使用 Tab 補全

```bash
/knowledge <Tab>  # 顯示可用子命令
```

### 2. 查看命令幫助

```bash
/knowledge --help
/checkpoint --help
```

### 3. 批次操作

```bash
# 一次索引多個目錄
/knowledge add --name all --path . --include docs/**,src/**
```

### 4. 使用相對路徑

```bash
/knowledge add --name docs --path ./docs
/knowledge add --name src --path ../other-project/src
```

## 常見問題

**Q: 命令不區分大小寫嗎？**  
A: 命令本身區分大小寫，但參數值通常不區分。

**Q: 可以撤銷命令嗎？**  
A: 某些命令（如 checkpoint）可以恢復，但大部分命令無法撤銷。

**Q: 命令歷史保存在哪裡？**  
A: 保存在 `.kiro/history` 目錄。

**Q: 如何清除命令歷史？**  
A: 刪除 `.kiro/history` 目錄。

## 總結

掌握這些命令，你就能充分發揮 Kiro CLI 的能力：
- ✅ 高效管理知識庫
- ✅ 追蹤開發進度
- ✅ 記錄重要節點
- ✅ 保存開發過程

開始使用 Kiro CLI 吧！
