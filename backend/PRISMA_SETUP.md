# Prisma 資料庫設定指南

本專案支援兩種資料庫模式：

1. **記憶體資料庫**（預設）：適合 demo 和開發測試
2. **Prisma + PostgreSQL**：適合生產環境

## 使用 Prisma（生產環境）

### 1. 安裝依賴

```bash
cd backend
npm install
```

### 2. 設定資料庫連線

複製 `.env.example` 為 `.env`：

```bash
cp .env.example .env
```

修改 `DATABASE_URL`：

```env
DATABASE_URL=postgresql://username:password@localhost:5432/myproject
```

### 3. 執行資料庫遷移

```bash
npm run prisma:migrate
```

這會建立資料庫表格並生成 Prisma Client。

### 4. 查看資料庫（選用）

```bash
npm run prisma:studio
```

在瀏覽器開啟 `http://localhost:5555` 查看資料。

## Prisma 常用指令

```bash
# 生成 Prisma Client
npm run prisma:generate

# 建立新的遷移
npm run prisma:migrate

# 開啟 Prisma Studio
npm run prisma:studio

# 重置資料庫（開發用）
npx prisma migrate reset
```

## 切換到 Prisma

目前程式碼使用記憶體資料庫。要切換到 Prisma：

1. 在 `src/models/` 建立 Prisma 版本的 User 和 Calculation models
2. 更新 `src/routes/` 使用 Prisma Client
3. 移除記憶體資料庫相關程式碼

範例程式碼請參考教學文件。
