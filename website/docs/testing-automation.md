# 測試自動化

學習如何讓 Kiro CLI 自動為每個功能建立測試。

## 為什麼需要測試自動化？

傳統開發流程：
```
實作功能 → (忘記寫測試) → 上線 → 出 bug 😱
```

自動化測試流程：
```
實作功能 → 自動建立測試 → 測試通過 → 上線 ✅
```

## 配置測試自動化

### 步驟 1：在規格中定義測試需求

編輯 `docs/spec.md`，加入測試需求：

```markdown
### 測試需求

#### 後端測試
- [ ] 單元測試：每個工具函數都要有單元測試
- [ ] API 測試：每個 API 端點都要有整合測試
- [ ] 測試覆蓋率：> 80%
- [ ] 測試框架：Jest + Supertest

#### 前端測試
- [ ] 元件測試：每個 React 元件都要有測試
- [ ] 互動測試：測試使用者互動行為
- [ ] 測試框架：Jest + React Testing Library

#### 測試原則
- **TDD 優先**：先寫測試，再實作功能
- **自動化**：每個功能實作時同步建立測試
- **持續整合**：測試失敗時不允許合併程式碼
```

### 步驟 2：配置 Agent

編輯 `.kiro/agents/project-dev.json`：

```json
{
  "description": "專案開發 agent - 包含自動化測試",
  "instructions": [
    "嚴格遵循 docs/spec.md 的規格要求",
    "每個功能實作時必須同時建立對應的測試",
    "使用 TDD（測試驅動開發）方式：先寫測試，再實作功能",
    "測試覆蓋率必須 > 80%",
    "測試失敗時不允許繼續開發"
  ]
}
```

## 使用方式

### 方法 1：明確要求測試

```
你: 實作用戶註冊功能

Kiro: 我會使用 TDD 方式開發：

步驟 1：建立測試
✓ tests/auth.test.ts

步驟 2：實作功能
✓ src/routes/auth.ts

步驟 3：執行測試
✓ All tests passed
```

### 方法 2：根據規格自動生成

```
你: 根據 spec.md 實作計算機功能

Kiro: 根據規格的測試需求，我會建立：

1. src/utils/calculator.ts（功能實作）
2. tests/calculator.test.ts（單元測試）
   - 測試加減乘除
   - 測試錯誤處理
   - 測試邊界情況

執行測試：npm test
預期覆蓋率：> 80%
```

### 方法 3：TDD 流程

```
你: 使用 TDD 開發用戶登入功能

Kiro: 
步驟 1：撰寫測試（定義預期行為）
```typescript
describe('Login', () => {
  it('should login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ 
        email: 'test@example.com', 
        password: 'password123' 
      });
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });
});
```

步驟 2：執行測試（應該失敗）
```bash
npm test
❌ Login › should login with correct credentials
```

步驟 3：實作功能（讓測試通過）
```typescript
router.post('/login', async (req, res) => {
  // 實作登入邏輯
});
```

步驟 4：再次執行測試
```bash
npm test
✓ Login › should login with correct credentials
```

## 實際範例

### 範例：開發計算機功能

#### 1. 定義需求

在 Kiro CLI 中：

```
你: 實作計算機功能，支援加減乘除
```

#### 2. Kiro 自動建立測試

```typescript
// tests/calculator.test.ts
import { evaluateExpression } from '../src/utils/calculator';

describe('Calculator', () => {
  it('should calculate addition', () => {
    expect(evaluateExpression('2 + 3')).toBe(5);
  });

  it('should calculate subtraction', () => {
    expect(evaluateExpression('5 - 3')).toBe(2);
  });

  it('should calculate multiplication', () => {
    expect(evaluateExpression('2 * 3')).toBe(6);
  });

  it('should calculate division', () => {
    expect(evaluateExpression('6 / 2')).toBe(3);
  });

  it('should throw error for invalid expression', () => {
    expect(() => evaluateExpression('2 + abc')).toThrow();
  });

  it('should throw error for division by zero', () => {
    expect(() => evaluateExpression('5 / 0')).toThrow();
  });
});
```

#### 3. Kiro 實作功能

```typescript
// src/utils/calculator.ts
export function evaluateExpression(expression: string): number {
  const cleaned = expression.replace(/\s/g, '');
  
  if (!/^[\d+\-*/.()]+$/.test(cleaned)) {
    throw new Error('Invalid expression');
  }

  if (/\/0(?!\d)/.test(cleaned)) {
    throw new Error('Division by zero');
  }

  const result = Function(`'use strict'; return (${cleaned})`)();
  return Number(result.toFixed(10));
}
```

#### 4. 執行測試

```bash
npm test

 PASS  tests/calculator.test.ts
  Calculator
    ✓ should calculate addition (2 ms)
    ✓ should calculate subtraction (1 ms)
    ✓ should calculate multiplication
    ✓ should calculate division
    ✓ should throw error for invalid expression (3 ms)
    ✓ should throw error for division by zero (1 ms)

Test Suites: 1 passed, 1 total
Tests:       6 passed, 6 total
Coverage:    85%
```

## 測試檢查清單

Kiro 會自動確保：

### 後端功能
- ✅ 每個 API 端點都有測試
- ✅ 測試成功和失敗情況
- ✅ 測試認證和授權
- ✅ 測試輸入驗證
- ✅ 測試錯誤處理
- ✅ 測試覆蓋率 > 80%

### 前端功能
- ✅ 每個元件都有測試
- ✅ 測試元件渲染
- ✅ 測試使用者互動
- ✅ 測試 API 整合
- ✅ 測試錯誤狀態

## 測試失敗處理

如果測試失敗，Kiro 會：

1. **停止開發**：不繼續實作新功能
2. **分析原因**：檢查測試失敗的原因
3. **修復問題**：修改程式碼讓測試通過
4. **重新測試**：確認所有測試通過

範例：

```
你: 繼續實作下一個功能

Kiro: ⚠️ 無法繼續，目前有測試失敗：

❌ Calculator › should handle division by zero

錯誤原因：函數沒有檢查除以零的情況

我會先修復這個問題...

[修改 calculator.ts]

重新執行測試：
✓ All tests passed

現在可以繼續開發下一個功能。
```

## 好處

### 1. 自動化
- ✅ 不需要手動記得寫測試
- ✅ Kiro 會自動提醒和建立測試

### 2. 品質保證
- ✅ 每個功能都有測試保護
- ✅ 減少 bug 和回歸問題

### 3. 文件化
- ✅ 測試即文件，清楚描述功能行為
- ✅ 新成員可以透過測試了解系統

### 4. 信心
- ✅ 修改程式碼時有測試保護
- ✅ 重構時不怕破壞現有功能

## 執行測試

### 後端測試

```bash
cd backend

# 執行所有測試
npm test

# 監聽模式（自動重新執行）
npm run test:watch

# 測試覆蓋率
npm run test:coverage
```

### 前端測試

```bash
cd website

# 執行所有測試
npm test

# 監聽模式
npm run test:watch
```

## 總結

配置測試自動化後：

1. ✅ 規格中定義測試需求
2. ✅ Agent 配置自動測試指示
3. ✅ TDD 流程支援
4. ✅ 測試覆蓋率要求
5. ✅ 測試失敗時停止開發

**每次開發新功能時，Kiro 會自動建立對應的測試！**

## 相關文件

- [測試指南](/docs/testing-guide) - 完整的測試教學
- [工作流程](/docs/workflow) - 開發流程說明
- [命令參考](/docs/commands) - Kiro CLI 命令
