---
sidebar_position: 1
---

# API 文件整合指南

本指南說明如何使用 Swagger JSDoc 和 Scalar 自動生成 API 文件。

## 查看 API 文件

啟動後端後，訪問：**http://localhost:3001/api-docs**

這是使用 Scalar 顯示的互動式 API 文件，包含：
- ✅ 所有 API 端點
- ✅ 請求/回應範例
- ✅ 內建測試功能
- ✅ 自動生成程式碼範例

## 工作原理

### 1. 在路由加入 JSDoc 註解

在 Express 路由檔案中加入 `@openapi` 註解：

```typescript title="backend/src/routes/auth.ts"
/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - 認證
 *     summary: 使用者登入
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
 *               password:
 *                 type: string
 *               rememberMe:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: 登入成功
 *       401:
 *         description: 認證失敗
 */
router.post('/login', async (req, res) => {
  // 實作...
});
```

### 2. Swagger JSDoc 自動掃描

`swagger-jsdoc` 會自動掃描所有路由檔案，從註解生成 OpenAPI 規格：

```typescript title="backend/src/swagger.ts"
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Project API',
      version: '1.0.0',
    },
  },
  apis: ['./src/routes/*.ts'], // 掃描所有路由
};

export const swaggerSpec = swaggerJsdoc(options);
```

### 3. Scalar 顯示文件

使用 `@scalar/express-api-reference` 在後端提供美觀的 API 文件頁面：

```typescript title="backend/src/index.ts"
import { apiReference } from '@scalar/express-api-reference';
import { swaggerSpec } from './swagger';

app.use(
  '/api-docs',
  apiReference({
    spec: {
      content: swaggerSpec,
    },
  })
);
```

## 整合步驟

### 1. 安裝套件

```bash
cd backend
npm install swagger-jsdoc @scalar/express-api-reference
npm install --save-dev @types/swagger-jsdoc
```

### 2. 建立 Swagger 配置

建立 `backend/src/swagger.ts`：

```typescript
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Project API',
      version: '1.0.0',
      description: 'API 文件',
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: '開發環境',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // 掃描路由檔案
};

export const swaggerSpec = swaggerJsdoc(options);
```

### 3. 在 Express 加入 Scalar 路由

修改 `backend/src/index.ts`：

```typescript
import { apiReference } from '@scalar/express-api-reference';
import { swaggerSpec } from './swagger';

// API Documentation
app.use(
  '/api-docs',
  apiReference({
    spec: {
      content: swaggerSpec,
    },
  })
);
```

### 4. 在路由加入註解

在每個 API 端點上方加入 JSDoc 註解：

```typescript
/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags:
 *       - 認證
 *     summary: 註冊新使用者
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: 註冊成功
 */
router.post('/register', async (req, res) => {
  // ...
});
```

## JSDoc 註解語法

### 基本結構

```yaml
/**
 * @openapi
 * /api/endpoint:
 *   method:
 *     tags:
 *       - 分類名稱
 *     summary: 簡短描述
 *     description: 詳細說明
 *     requestBody:
 *       # 請求內容
 *     responses:
 *       # 回應定義
 */
```

### 需要認證的端點

```yaml
/**
 * @openapi
 * /api/protected:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     # ...
 */
```

### 請求參數

```yaml
/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 */
```

## 使用 API 文件

### 1. 瀏覽端點

在左側選單點擊任一 API 端點，查看詳細資訊。

### 2. 測試 API

1. 點擊「Try it out」按鈕
2. 填寫必要參數
3. 如需認證，點擊右上角「Authorize」輸入 JWT token
4. 點擊「Execute」執行請求
5. 查看回應結果

### 3. 複製程式碼

Scalar 自動生成多種語言的程式碼範例：
- JavaScript (fetch)
- cURL
- Python
- PHP
- Go

點擊程式碼區塊右上角的複製按鈕即可使用。

## 最佳實踐

### 1. 使用 Tags 分組

將相關的 API 歸類到同一個 tag：

```yaml
tags:
  - 認證  # 所有認證相關 API
```

### 2. 提供範例值

```yaml
properties:
  username:
    type: string
    example: testuser
    description: 使用者名稱
```

### 3. 完整的錯誤回應

```yaml
responses:
  400:
    description: 請求錯誤
  401:
    description: 未授權
  404:
    description: 找不到資源
  500:
    description: 伺服器錯誤
```

## 與 ASP.NET Core 的比較

| 功能 | ASP.NET Core | Express + Swagger JSDoc |
|------|--------------|-------------------------|
| 自動生成 | ✅ Swashbuckle | ✅ swagger-jsdoc |
| 註解方式 | XML 註解 / Attributes | JSDoc 註解 |
| UI 工具 | Swagger UI | Scalar (更現代) |
| 路由掃描 | 自動 | 需配置路徑 |

## 常見問題

### Q: 為什麼我的 API 沒有出現在文件中？

A: 檢查：
1. 路由檔案是否在 `swagger.ts` 的 `apis` 路徑中
2. JSDoc 註解格式是否正確
3. 是否有 `@openapi` 標籤

### Q: 如何測試需要認證的 API？

A: 
1. 先呼叫 `/api/auth/login` 取得 token
2. 點擊右上角「Authorize」按鈕
3. 輸入 token（不需要加 Bearer 前綴，Scalar 會自動加）
4. 之後的請求會自動帶上認證

### Q: 可以匯出 OpenAPI 規格嗎？

A: 可以！在 Scalar 介面中可以下載 OpenAPI 規格檔案。

## 延伸閱讀

- [Swagger JSDoc 文件](https://github.com/Surnet/swagger-jsdoc)
- [Scalar 官方文件](https://github.com/scalar/scalar)
- [OpenAPI 3.0 規格](https://swagger.io/specification/)
