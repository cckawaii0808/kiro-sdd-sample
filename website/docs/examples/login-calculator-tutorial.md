# 實戰教學：登入計算機專案

完整展示如何使用 Kiro CLI 從零開始建立一個包含登入功能和計算機的 Web 應用。

## 專案概述

我們要建立一個 Web 應用，包含：
- ✅ 用戶註冊和登入
- ✅ JWT 認證
- ✅ 線上計算機
- ✅ 計算歷史記錄
- ✅ 前後端分離
- ✅ 完整測試

## 第一部分：專案初始化

### 步驟 1：建立專案結構

```bash
# 建立專案目錄
mkdir login-calculator
cd login-calculator

# 建立基本結構
mkdir -p docs backend/src/{routes,models,middleware,utils,tests} frontend/src/{components,pages,services,tests}

# 初始化 Git
git init
```

### 步驟 2：撰寫規格文件

建立 `docs/spec.md`：

```markdown
# 登入計算機專案規格

## 功能需求

### 用戶認證
- [ ] 用戶註冊（email + 密碼 + 姓名）
- [ ] 用戶登入（支援「記住我」）
- [ ] JWT 認證

### 計算機功能
- [ ] 基本運算（+、-、×、÷）
- [ ] 小數點運算
- [ ] 計算歷史記錄
- [ ] 清除功能

## 技術架構
- 後端：TypeScript + Express + PostgreSQL
- 前端：React + TypeScript
- 認證：JWT
- 測試：Jest
```

完整規格請參考：[完整規格文件](https://github.com/cckawaii0808/kiro-sdd-sample/blob/main/docs/spec.md)

### 步驟 3：啟動 Kiro CLI

```bash
# 啟動 Kiro CLI
kiro-cli chat

# 啟用功能
/experiment enable knowledge
/experiment enable todos
/experiment enable checkpointing
```

### 步驟 4：建立知識庫

```bash
# 索引規格文件
/knowledge add --name docs --path docs/

# 索引程式碼（稍後）
/knowledge add --name backend --path backend/src/
/knowledge add --name frontend --path frontend/src/
```

## 第二部分：生成開發計畫

### 與 Kiro 對話

```
你: 根據 docs/spec.md 建立完整的開發計畫，包含前後端和測試

Kiro: 我已經分析了規格文件。讓我為你建立開發計畫...

TODO List: 登入計算機專案

後端開發：
[ ] 1. 設計資料庫 schema（User、Calculation）
[ ] 2. 建立 Express 專案結構
[ ] 3. 實作 User 模型和密碼加密
[ ] 4. 實作 JWT 認證中介層
[ ] 5. 實作註冊 API
[ ] 6. 實作登入 API
[ ] 7. 實作計算機 API
[ ] 8. 實作計算歷史 API
[ ] 9. 撰寫後端測試

前端開發：
[ ] 10. 建立 React 專案結構
[ ] 11. 實作 LoginForm 元件
[ ] 12. 實作 Calculator 元件
[ ] 13. 實作 API 服務層
[ ] 14. 實作路由和認證保護
[ ] 15. 撰寫前端測試

整合與部署：
[ ] 16. 整合前後端
[ ] 17. 環境變數配置
[ ] 18. 建立部署腳本
```

## 第三部分：後端開發

### 任務 1：設計資料庫 Schema

```
你: 開始第一個任務：設計資料庫 schema

Kiro: 根據規格，我們需要兩個資料表...
```

本專案支援兩種資料庫方式：

#### 方式 1：記憶體資料庫（Demo 用）

適合快速開發和展示，無需安裝資料庫。資料存在記憶體中，重啟後清空。

建立 `backend/src/models/database.ts`：

```typescript
interface User {
  id: string;
  username: string;
  password: string;
  createdAt: Date;
}

interface Calculation {
  id: string;
  userId: string;
  operation: string;
  operand1: number;
  operand2: number;
  result: number;
  createdAt: Date;
}

export const db = {
  users: [] as User[],
  calculations: [] as Calculation[]
};
```

#### 方式 2：Prisma + PostgreSQL（生產環境）

適合正式部署，資料持久化儲存。

建立 `backend/prisma/schema.prisma`：

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id           String        @id @default(uuid())
  username     String        @unique
  password     String
  createdAt    DateTime      @default(now())
  calculations Calculation[]
}

model Calculation {
  id        String   @id @default(uuid())
  userId    String
  operation String
  operand1  Float
  operand2  Float
  result    Float
  createdAt DateTime @default(now())
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
}
```

設定 `.env`：

```env
DATABASE_URL=postgresql://user:password@localhost:5432/myproject
```

執行遷移：

```bash
npm run prisma:migrate
```

:::tip
本教學使用**記憶體資料庫**方式，讓你無需安裝 PostgreSQL 即可快速體驗。生產環境建議使用 Prisma，詳見 `backend/PRISMA_SETUP.md`。
:::

### 任務 2-4：實作認證功能

**User 模型** (`backend/src/models/user.ts`)：

```typescript
import bcrypt from 'bcrypt';

export class UserModel {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
```

**JWT 中介層** (`backend/src/middleware/auth.ts`)：

```typescript
import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.substring(7);
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
```

**認證路由** (`backend/src/routes/auth.ts`)：

完整程式碼請參考：[auth.ts](https://github.com/cckawaii0808/kiro-sdd-sample/blob/main/backend/src/routes/auth.ts)

### 任務 5-8：實作計算機功能

**計算機工具** (`backend/src/utils/calculator.ts`)：

```typescript
export function evaluateExpression(expression: string): number {
  const cleaned = expression.replace(/\s/g, '');
  
  // 驗證表達式
  if (!/^[\d+\-*/.()]+$/.test(cleaned)) {
    throw new Error('Invalid expression');
  }

  // 安全評估
  const result = Function(`'use strict'; return (${cleaned})`)();
  return Number(result.toFixed(10));
}
```

**計算機路由** (`backend/src/routes/calculator.ts`)：

完整程式碼請參考：[calculator.ts](https://github.com/cckawaii0808/kiro-sdd-sample/blob/main/backend/src/routes/calculator.ts)

### 任務 9：撰寫測試

**計算機測試** (`backend/tests/calculator.test.ts`)：

```typescript
import { evaluateExpression } from '../src/utils/calculator';

describe('Calculator', () => {
  it('should calculate addition', () => {
    expect(evaluateExpression('2 + 3')).toBe(5);
  });

  it('should handle complex expressions', () => {
    expect(evaluateExpression('2 + 3 * 4')).toBe(14);
  });

  it('should throw error for invalid expression', () => {
    expect(() => evaluateExpression('2 + abc')).toThrow();
  });
});
```

執行測試：

```bash
cd backend
npm test
```

### 建立檢查點

```bash
/checkpoint create "完成後端開發"
```

## 第四部分：前端開發

### 任務 10-12：實作 React 元件

**LoginForm 元件** (`frontend/src/components/LoginForm.tsx`)：

完整程式碼請參考：[LoginForm.tsx](https://github.com/cckawaii0808/kiro-sdd-sample/blob/main/website/src/components/demo/LoginForm.tsx)

**Calculator 元件** (`frontend/src/components/Calculator.tsx`)：

完整程式碼請參考：[CalculatorDemo.tsx](https://github.com/cckawaii0808/kiro-sdd-sample/blob/main/website/src/components/demo/CalculatorDemo.tsx)

### 任務 13：實作 API 服務

**API 服務** (`frontend/src/services/api.ts`)：

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
});

// 自動加入 token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (email: string, password: string, name: string) =>
    api.post('/auth/register', { email, password, name }),
  
  login: (email: string, password: string, rememberMe: boolean) =>
    api.post('/auth/login', { email, password, rememberMe }),
  
  getMe: () => api.get('/auth/me'),
};

export const calculatorAPI = {
  calculate: (expression: string) =>
    api.post('/calculator/calculate', { expression }),
  
  getHistory: (limit = 10) =>
    api.get(`/calculator/history?limit=${limit}`),
  
  clearHistory: () => api.delete('/calculator/history'),
};
```

### 任務 14：實作路由

**App.tsx**：

```typescript
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { useAuth } from './hooks/useAuth';

function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/calculator"
          element={
            <PrivateRoute>
              <CalculatorPage />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/calculator" />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 建立檢查點

```bash
/checkpoint create "完成前端開發"
```

## 第五部分：如何調整規格

### 場景 1：新增功能

假設你想加入「科學計算」功能：

#### 1. 更新規格文件

在 `docs/spec.md` 加入：

```markdown
### 2.3 科學計算功能
- [ ] 支援 sin, cos, tan
- [ ] 支援 log, ln
- [ ] 支援平方根
- [ ] 支援次方運算
```

#### 2. 重新生成計畫

```
你: 規格已更新，加入了科學計算功能。請更新開發計畫

Kiro: 我看到規格新增了科學計算功能。讓我更新 TODO...

新增任務：
[ ] 17. 實作科學計算函數
[ ] 18. 更新計算機 UI（加入科學計算按鈕）
[ ] 19. 更新測試
```

#### 3. 實作新功能

```
你: 開始實作科學計算功能

Kiro: 我會先更新 calculator.ts 加入科學計算函數...
```

### 場景 2：修改現有功能

假設你想把「記住我」從 30 天改成 7 天：

#### 1. 更新規格

```markdown
- [ ] 支援「記住我」功能（7 天有效期）  // 原本是 30 天
```

#### 2. 詢問 Kiro

```
你: 規格已更新，「記住我」功能改成 7 天。請幫我更新相關程式碼

Kiro: 我會更新以下檔案：
1. backend/src/routes/auth.ts - 修改 JWT 過期時間
2. docs/spec.md - 確認規格已更新

[顯示程式碼變更]
```

### 場景 3：移除功能

假設你決定不需要計算歷史功能：

#### 1. 更新規格

刪除或註解掉計算歷史相關需求

#### 2. 詢問 Kiro

```
你: 我決定移除計算歷史功能。請幫我清理相關程式碼

Kiro: 我會移除以下內容：
1. Calculation 資料模型
2. 計算歷史 API 端點
3. 前端歷史記錄元件
4. 相關測試

是否確認？
```

## 第六部分：測試策略

### 後端測試

**單元測試**：

```typescript
// tests/calculator.test.ts
describe('Calculator Utils', () => {
  it('should calculate correctly', () => {
    expect(evaluateExpression('2 + 3')).toBe(5);
  });
});
```

**API 測試**：

```typescript
// tests/api.test.ts
import request from 'supertest';
import app from '../src/app';

describe('Auth API', () => {
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
});
```

### 前端測試

**元件測試**：

```typescript
// tests/Calculator.test.tsx
import { render, fireEvent } from '@testing-library/react';
import { Calculator } from '../components/Calculator';

describe('Calculator Component', () => {
  it('should display numbers when clicked', () => {
    const { getByText, getByRole } = render(
      <Calculator onCalculate={jest.fn()} />
    );
    
    fireEvent.click(getByText('2'));
    fireEvent.click(getByText('+'));
    fireEvent.click(getByText('3'));
    
    expect(getByRole('textbox')).toHaveValue('2 + 3');
  });
});
```

### 執行所有測試

```bash
# 後端測試
cd backend
npm test

# 前端測試
cd frontend
npm test

# 測試覆蓋率
npm test -- --coverage
```

## 第七部分：部署

### 環境變數設定

**後端 `.env`**：

```env
DATABASE_URL=postgresql://user:password@localhost:5432/login_calculator
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=1h
JWT_REMEMBER_EXPIRES_IN=7d
PORT=3001
NODE_ENV=production
```

**前端 `.env`**：

```env
REACT_APP_API_URL=https://api.yourdomain.com
```

### 建置和部署

```bash
# 後端
cd backend
npm run build
npm start

# 前端
cd frontend
npm run build
# 部署 build/ 目錄到靜態託管服務
```

## 第八部分：保存開發過程

```bash
# 建立最終檢查點
/checkpoint create "專案完成"

# 保存對話
/save "登入計算機專案開發"

# 查看所有檢查點
/checkpoint list
```

## 總結

### 你學到了什麼

1. **規格驅動開發**：從明確的規格開始
2. **AI 協作**：Kiro 協助拆解任務和生成程式碼
3. **完整流程**：從規格到測試到部署
4. **規格調整**：如何修改規格並更新程式碼
5. **測試策略**：前後端測試的最佳實踐

### 專案統計

- **開發時間**：約 4-6 小時
- **程式碼行數**：~1500 行
- **測試覆蓋率**：> 80%
- **API 端點**：8 個
- **React 元件**：5 個

### 下一步

- [ ] 加入更多功能（科學計算、單位轉換）
- [ ] 改善 UI/UX
- [ ] 加入更多測試
- [ ] 效能優化
- [ ] 部署到生產環境

## 完整原始碼

完整的專案原始碼可以在這裡找到：
- [GitHub Repository](https://github.com/cckawaii0808/kiro-sdd-sample)
- [線上 Demo](https://cckawaii0808.github.io/kiro-sdd-sample/demo)

## 常見問題

**Q: 如果我想改用 MongoDB 而不是 PostgreSQL？**  
A: 更新 `spec.md` 的資料庫選項，然後告訴 Kiro：「我想改用 MongoDB，請幫我更新資料模型和連線設定」

**Q: 如何加入更多測試？**  
A: 告訴 Kiro：「請為 XXX 功能加入更多測試案例」，它會生成測試程式碼

**Q: 前後端如何整合？**  
A: 使用 CORS 設定，並在前端配置 API baseURL

**Q: 如何處理錯誤？**  
A: 後端使用統一的錯誤處理中介層，前端使用 try-catch 和錯誤狀態

開始建立你的專案吧！🚀
