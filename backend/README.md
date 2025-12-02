# Backend API

登入計算機後端 API

## 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 設定環境變數

```bash
cp .env.example .env
# 編輯 .env 設定 JWT_SECRET
```

### 3. 啟動開發伺服器

```bash
npm run dev
```

伺服器將在 http://localhost:3001 啟動

## API 端點

### 認證

- `POST /api/auth/register` - 註冊
- `POST /api/auth/login` - 登入
- `GET /api/auth/me` - 取得當前用戶（需要認證）

### 計算機

- `POST /api/calculator/calculate` - 執行計算（需要認證）
- `GET /api/calculator/history` - 取得計算歷史（需要認證）
- `DELETE /api/calculator/history` - 清除歷史（需要認證）

## 測試

### 執行所有測試

```bash
npm test
```

### 執行特定測試

```bash
npm test calculator.test.ts
npm test api.test.ts
```

### 監聽模式

```bash
npm run test:watch
```

### 測試覆蓋率

```bash
npm run test:coverage
```

## 建置

```bash
npm run build
npm start
```

## 專案結構

```
backend/
├── src/
│   ├── index.ts           # 主程式
│   ├── models/
│   │   ├── db.ts         # 記憶體資料庫
│   │   └── user.ts       # User 模型
│   ├── routes/
│   │   ├── auth.ts       # 認證路由
│   │   └── calculator.ts # 計算機路由
│   ├── middleware/
│   │   └── auth.ts       # JWT 中介層
│   └── utils/
│       └── calculator.ts # 計算工具
└── tests/
    ├── calculator.test.ts # 單元測試
    └── api.test.ts       # API 整合測試
```

## 注意事項

- 目前使用記憶體資料庫（重啟後資料會消失）
- 生產環境應使用 PostgreSQL + Prisma
- 記得更改 JWT_SECRET
- 測試覆蓋率目標 > 80%

## 測試範例

### 單元測試

```typescript
import { evaluateExpression } from '../src/utils/calculator';

it('should calculate correctly', () => {
  expect(evaluateExpression('2 + 3')).toBe(5);
});
```

### API 測試

```typescript
import request from 'supertest';
import app from '../src/index';

it('should register user', async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
    });

  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty('token');
});
```

完整測試教學請參考：[測試指南](../website/docs/testing-guide.md)
