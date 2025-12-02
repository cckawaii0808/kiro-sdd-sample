# API 規格範例

學習如何撰寫清晰、完整的 API 規格文件。

## 為什麼需要 API 規格？

- ✅ 前後端開發者有共同的參考
- ✅ 減少溝通成本和誤解
- ✅ 可以直接轉換為測試案例
- ✅ 自動生成 API 文件

## 規格文件範本

以下是完整的 API 規格範例，展示如何定義端點、請求、回應和錯誤處理。

---

## 用戶註冊 API

### 端點
```
POST /api/users/register
```

### 請求標頭
```
Content-Type: application/json
```

### 請求主體
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### 驗證規則
- `username`: 3-20 字元，只能包含字母、數字、底線
- `email`: 有效的 email 格式
- `password`: 至少 8 字元，包含大小寫字母和數字

### 成功回應 (201 Created)
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2025-12-02T08:38:42.000Z"
  },
  "message": "User registered successfully"
}
```

### 錯誤回應

#### 400 Bad Request - 驗證失敗
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

#### 409 Conflict - 用戶已存在
```json
{
  "success": false,
  "error": {
    "code": "USER_EXISTS",
    "message": "Username or email already exists"
  }
}
```

---

## 用戶登入 API

### 端點
```
POST /api/auth/login
```

### 請求主體
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

### 成功回應 (200 OK)
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 900,
    "user": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "username": "john_doe",
      "email": "john@example.com"
    }
  }
}
```

### 錯誤回應

#### 401 Unauthorized - 認證失敗
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password"
  }
}
```

---

## 取得用戶資訊 API

### 端點
```
GET /api/users/:id
```

### 請求標頭
```
Authorization: Bearer <access_token>
```

### 成功回應 (200 OK)
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "john_doe",
    "email": "john@example.com",
    "createdAt": "2025-12-02T08:38:42.000Z",
    "updatedAt": "2025-12-02T08:38:42.000Z"
  }
}
```

### 錯誤回應

#### 401 Unauthorized - Token 無效
```json
{
  "success": false,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "Invalid or expired token"
  }
}
```

#### 404 Not Found - 用戶不存在
```json
{
  "success": false,
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "User not found"
  }
}
```

---

## 錯誤碼對照表

| 錯誤碼 | HTTP 狀態 | 說明 |
|--------|-----------|------|
| VALIDATION_ERROR | 400 | 輸入資料驗證失敗 |
| USER_EXISTS | 409 | 用戶已存在 |
| INVALID_CREDENTIALS | 401 | 認證資訊錯誤 |
| INVALID_TOKEN | 401 | Token 無效或過期 |
| USER_NOT_FOUND | 404 | 用戶不存在 |
| FORBIDDEN | 403 | 無權限存取 |
| INTERNAL_ERROR | 500 | 伺服器內部錯誤 |
| RATE_LIMIT_EXCEEDED | 429 | 請求頻率超過限制 |
