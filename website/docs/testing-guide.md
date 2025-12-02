# 測試指南

完整的前後端測試教學。

## 後端測試

### 測試環境設定

#### 1. 安裝測試依賴

```bash
cd backend
npm install
```

已安裝的測試工具：
- **Jest**：測試框架
- **Supertest**：HTTP 測試
- **ts-jest**：TypeScript 支援

#### 2. Jest 配置

`backend/jest.config.js`：

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
  ],
};
```

### 單元測試

#### 測試計算機工具

`backend/tests/calculator.test.ts`：

```typescript
import { evaluateExpression } from '../src/utils/calculator';

describe('Calculator Utils', () => {
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

**執行單元測試**：

```bash
npm test calculator.test.ts
```

### API 整合測試

#### 測試認證 API

`backend/tests/api.test.ts`：

```typescript
import request from 'supertest';
import app from '../src/index';

describe('Auth API', () => {
  it('should register a new user', async () => {
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

  it('should login with correct credentials', async () => {
    // 先註冊
    await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });

    // 再登入
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
```

#### 測試計算機 API

```typescript
describe('Calculator API', () => {
  let token: string;

  beforeEach(async () => {
    // 註冊並取得 token
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      });
    token = res.body.token;
  });

  it('should calculate expression', async () => {
    const res = await request(app)
      .post('/api/calculator/calculate')
      .set('Authorization', `Bearer ${token}`)
      .send({ expression: '2 + 3' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('result', 5);
  });

  it('should require authentication', async () => {
    const res = await request(app)
      .post('/api/calculator/calculate')
      .send({ expression: '2 + 3' });

    expect(res.status).toBe(401);
  });
});
```

### 執行測試

#### 執行所有測試

```bash
npm test
```

#### 執行特定測試檔案

```bash
npm test calculator.test.ts
npm test api.test.ts
```

#### 監聽模式（自動重新執行）

```bash
npm run test:watch
```

#### 測試覆蓋率

```bash
npm run test:coverage
```

輸出範例：

```
--------------------|---------|----------|---------|---------|
File                | % Stmts | % Branch | % Funcs | % Lines |
--------------------|---------|----------|---------|---------|
All files           |   85.71 |    83.33 |   88.89 |   85.71 |
 utils/calculator.ts|   100   |    100   |   100   |   100   |
 routes/auth.ts     |   80.5  |    75    |   85.7  |   80.5  |
--------------------|---------|----------|---------|---------|
```

### 測試最佳實踐

#### 1. 使用 describe 分組

```typescript
describe('User Model', () => {
  describe('hashPassword', () => {
    it('should hash password correctly', async () => {
      // 測試
    });
  });

  describe('comparePassword', () => {
    it('should compare password correctly', async () => {
      // 測試
    });
  });
});
```

#### 2. 使用 beforeEach 清理

```typescript
describe('API Tests', () => {
  beforeEach(() => {
    // 清除資料庫
    db.clear();
  });

  it('should work', () => {
    // 測試
  });
});
```

#### 3. 測試邊界情況

```typescript
it('should handle edge cases', () => {
  expect(evaluateExpression('0 + 0')).toBe(0);
  expect(evaluateExpression('-5 + 3')).toBe(-2);
  expect(() => evaluateExpression('')).toThrow();
});
```

#### 4. 測試錯誤處理

```typescript
it('should handle errors', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: 'invalid' });

  expect(res.status).toBe(400);
  expect(res.body).toHaveProperty('error');
});
```

## 前端測試

### 測試環境設定

#### 1. 安裝測試依賴

```bash
cd website
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom
```

#### 2. Jest 配置

`website/jest.config.js`：

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
};
```

`website/jest.setup.js`：

```javascript
import '@testing-library/jest-dom';
```

### 元件測試

#### 測試 Calculator 元件

`website/src/components/demo/__tests__/CalculatorDemo.test.tsx`：

```typescript
import { render, fireEvent, screen } from '@testing-library/react';
import CalculatorDemo from '../CalculatorDemo';

describe('CalculatorDemo', () => {
  it('should render calculator', () => {
    render(<CalculatorDemo />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should display numbers when clicked', () => {
    render(<CalculatorDemo />);
    
    fireEvent.click(screen.getByText('2'));
    expect(screen.getByText('2')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('3'));
    expect(screen.getByText('23')).toBeInTheDocument();
  });

  it('should calculate addition', () => {
    render(<CalculatorDemo />);
    
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('3'));
    fireEvent.click(screen.getByText('='));
    
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('should clear display', () => {
    render(<CalculatorDemo />);
    
    fireEvent.click(screen.getByText('5'));
    fireEvent.click(screen.getByText('C'));
    
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('should show history', () => {
    render(<CalculatorDemo />);
    
    // 執行計算
    fireEvent.click(screen.getByText('2'));
    fireEvent.click(screen.getByText('+'));
    fireEvent.click(screen.getByText('3'));
    fireEvent.click(screen.getByText('='));
    
    // 檢查歷史
    expect(screen.getByText('= 5')).toBeInTheDocument();
  });
});
```

### 執行前端測試

```bash
cd website
npm test
```

### 測試使用者互動

#### 使用 userEvent

```typescript
import userEvent from '@testing-library/user-event';

it('should handle user input', async () => {
  const user = userEvent.setup();
  render(<LoginForm />);
  
  const emailInput = screen.getByLabelText('Email');
  await user.type(emailInput, 'test@example.com');
  
  expect(emailInput).toHaveValue('test@example.com');
});
```

### 測試 API 呼叫

#### Mock API

```typescript
import { rest } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  rest.post('/api/auth/login', (req, res, ctx) => {
    return res(ctx.json({ token: 'fake-token' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('should login successfully', async () => {
  render(<LoginForm />);
  
  // 填寫表單
  // 提交
  // 驗證結果
});
```

## 測試策略

### 測試金字塔

```
       /\
      /  \     E2E 測試（少量）
     /____\
    /      \   整合測試（適量）
   /________\
  /          \ 單元測試（大量）
 /____________\
```

### 測試覆蓋率目標

- **單元測試**：> 80%
- **整合測試**：關鍵流程 100%
- **E2E 測試**：主要使用者流程

### 測試檢查清單

#### 後端

- [ ] 所有 API 端點都有測試
- [ ] 測試成功和失敗情況
- [ ] 測試認證和授權
- [ ] 測試輸入驗證
- [ ] 測試錯誤處理

#### 前端

- [ ] 元件渲染測試
- [ ] 使用者互動測試
- [ ] 表單驗證測試
- [ ] API 整合測試
- [ ] 錯誤狀態測試

## CI/CD 整合

### GitHub Actions

`.github/workflows/test.yml`：

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: cd backend && npm ci
      - name: Run tests
        run: cd backend && npm test
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - name: Install dependencies
        run: cd website && npm ci
      - name: Run tests
        run: cd website && npm test
```

## 常見問題

**Q: 測試執行很慢怎麼辦？**  
A: 使用 `--maxWorkers=50%` 限制並行數量

**Q: 如何測試非同步程式碼？**  
A: 使用 `async/await` 或 `done` callback

**Q: 如何 mock 外部依賴？**  
A: 使用 `jest.mock()` 或 MSW

**Q: 測試覆蓋率要達到多少？**  
A: 建議 > 80%，但重質不重量

## 總結

良好的測試策略：
- ✅ 自動化測試
- ✅ 快速回饋
- ✅ 高覆蓋率
- ✅ 易於維護
- ✅ CI/CD 整合

開始為你的專案撰寫測試吧！
