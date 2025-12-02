---
sidebar_position: 3
---

# React 專案架構基礎

本文介紹 React 專案的基本架構概念，幫助你理解頁面、元件、樣式的組織方式。

## 核心概念

### 頁面 vs 元件

React 專案通常分為兩種檔案類型：

- **頁面（Pages）**：完整的獨立頁面，有自己的路由（網址）
- **元件（Components）**：可重複使用的 UI 片段，沒有路由

就像蓋房子：
- 頁面是完整的房間（客廳、臥室）
- 元件是家具（沙發、桌子），可以放在不同房間

## 目錄結構

```
src/
├── pages/              # 頁面（有路由）
│   ├── index.tsx       # 首頁 → /
│   ├── demo.tsx        # Demo 頁 → /demo
│   └── login.tsx       # 登入頁 → /login
│
├── components/         # 元件（可重複使用）
│   ├── demo/
│   │   ├── LoginForm.tsx
│   │   ├── LoginForm.module.css
│   │   ├── CalculatorDemo.tsx
│   │   └── CalculatorDemo.module.css
│   └── HomepageFeatures/
│       └── index.tsx
│
└── css/               # 全域樣式
    └── custom.css
```

## 頁面（Pages）

### 什麼是頁面？

頁面是使用者可以直接訪問的完整網頁，每個頁面檔案對應一個路由。

**範例：首頁**

```tsx title="src/pages/index.tsx"
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

export default function Home() {
  return (
    <Layout title="首頁" description="網站首頁">
      <main>
        <h1>歡迎來到我的網站</h1>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
```

**路由對應**：
- `pages/index.tsx` → `http://localhost:3000/`
- `pages/demo.tsx` → `http://localhost:3000/demo`
- `pages/about.tsx` → `http://localhost:3000/about`

### 頁面的職責

✅ 定義路由和網址  
✅ 設定頁面標題和 meta 資訊  
✅ 組合多個元件形成完整頁面  
✅ 處理頁面層級的狀態管理  

## 元件（Components）

### 什麼是元件？

元件是可重複使用的 UI 片段，沒有自己的路由，需要被頁面引入使用。

**範例：登入表單元件**

```tsx title="src/components/demo/LoginForm.tsx"
import React, { useState } from 'react';
import styles from './LoginForm.module.css';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 處理登入邏輯
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="使用者名稱"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="密碼"
      />
      <button type="submit">登入</button>
    </form>
  );
}
```

### 元件的職責

✅ 實作特定功能（表單、按鈕、卡片等）  
✅ 可在多個頁面重複使用  
✅ 保持獨立和可測試  
✅ 管理自己的內部狀態  

### 元件重用範例

同一個 `LoginForm` 元件可以在多個頁面使用：

```tsx title="src/pages/login.tsx"
import LoginForm from '@site/src/components/demo/LoginForm';

export default function LoginPage() {
  return (
    <Layout>
      <LoginForm />  {/* 重用元件 */}
    </Layout>
  );
}
```

```tsx title="src/pages/demo.tsx"
import LoginForm from '@site/src/components/demo/LoginForm';

export default function DemoPage() {
  return (
    <Layout>
      <h1>互動 Demo</h1>
      <LoginForm />  {/* 同一個元件 */}
    </Layout>
  );
}
```

## 樣式管理

### CSS Module（推薦）

CSS Module 讓每個元件有自己的樣式，避免 class name 衝突。

**檔案結構**：
```
components/
  demo/
    LoginForm.tsx
    LoginForm.module.css  ← 注意 .module.css
```

**使用方式**：

```tsx title="LoginForm.tsx"
import styles from './LoginForm.module.css';

export default function LoginForm() {
  return (
    <div className={styles.container}>
      <button className={styles.submitButton}>登入</button>
    </div>
  );
}
```

```css title="LoginForm.module.css"
.container {
  padding: 20px;
  background: white;
}

.submitButton {
  background: blue;
  color: white;
}
```

### 為什麼使用 CSS Module？

✅ **避免衝突**：自動生成唯一的 class name  
✅ **易於維護**：CSS 和元件放在一起  
✅ **刪除安全**：刪除元件時不會忘記刪 CSS  
✅ **TypeScript 支援**：可以自動補全 class name  

### 其他樣式方案

#### 1. 全域 CSS
```tsx
import './global.css';  // 影響整個網站
```

#### 2. Inline Styles
```tsx
<div style={{ padding: '20px', background: 'white' }}>
```

#### 3. CSS-in-JS（styled-components）
```tsx
const Button = styled.button`
  background: blue;
  color: white;
`;
```

## 完整範例：登入功能

### 1. 建立登入元件

```tsx title="src/components/demo/LoginForm.tsx"
import React, { useState } from 'react';
import styles from './LoginForm.module.css';

interface LoginFormProps {
  onLoginSuccess?: (token: string) => void;
}

export default function LoginForm({ onLoginSuccess }: LoginFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();
      
      if (response.ok) {
        onLoginSuccess?.(data.token);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('登入失敗');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {error && <div className={styles.error}>{error}</div>}
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="使用者名稱"
        className={styles.input}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="密碼"
        className={styles.input}
      />
      <button type="submit" className={styles.button}>
        登入
      </button>
    </form>
  );
}
```

```css title="src/components/demo/LoginForm.module.css"
.form {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.button {
  width: 100%;
  padding: 10px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.button:hover {
  background: #0056b3;
}

.error {
  color: red;
  margin-bottom: 10px;
}
```

### 2. 建立登入頁面

```tsx title="src/pages/login.tsx"
import Layout from '@theme/Layout';
import LoginForm from '@site/src/components/demo/LoginForm';
import { useHistory } from '@docusaurus/router';

export default function LoginPage() {
  const history = useHistory();

  const handleLoginSuccess = (token: string) => {
    localStorage.setItem('token', token);
    history.push('/demo');  // 登入成功後跳轉
  };

  return (
    <Layout title="登入" description="使用者登入">
      <main style={{ padding: '2rem' }}>
        <h1>登入</h1>
        <LoginForm onLoginSuccess={handleLoginSuccess} />
      </main>
    </Layout>
  );
}
```

### 3. 在 Demo 頁面重用

```tsx title="src/pages/demo.tsx"
import Layout from '@theme/Layout';
import LoginForm from '@site/src/components/demo/LoginForm';
import CalculatorDemo from '@site/src/components/demo/CalculatorDemo';
import { useState } from 'react';

export default function DemoPage() {
  const [token, setToken] = useState<string | null>(null);

  if (!token) {
    return (
      <Layout title="Demo">
        <LoginForm onLoginSuccess={setToken} />
      </Layout>
    );
  }

  return (
    <Layout title="Demo">
      <CalculatorDemo token={token} />
    </Layout>
  );
}
```

## 最佳實踐

### 1. 元件命名

✅ 使用 PascalCase：`LoginForm.tsx`、`CalculatorDemo.tsx`  
✅ 檔名與元件名稱一致  
✅ CSS Module 使用 `.module.css` 後綴  

### 2. 目錄組織

```
components/
  demo/              # 按功能分組
    LoginForm.tsx
    LoginForm.module.css
    CalculatorDemo.tsx
    CalculatorDemo.module.css
  common/            # 通用元件
    Button.tsx
    Input.tsx
```

### 3. Props 設計

```tsx
// ✅ 使用 interface 定義 props
interface LoginFormProps {
  onLoginSuccess?: (token: string) => void;
  initialUsername?: string;
}

// ✅ 提供預設值
export default function LoginForm({ 
  onLoginSuccess,
  initialUsername = ''
}: LoginFormProps) {
  // ...
}
```

### 4. 狀態管理

- **元件內部狀態**：使用 `useState`
- **跨元件狀態**：透過 props 傳遞
- **全域狀態**：使用 Context API 或狀態管理庫

## 總結

| 類型 | 位置 | 路由 | 用途 |
|------|------|------|------|
| **頁面** | `src/pages/` | ✅ 有 | 完整網頁 |
| **元件** | `src/components/` | ❌ 無 | 可重用 UI |
| **樣式** | `.module.css` | - | 元件專屬樣式 |

### 開發流程

1. **規劃功能** → 確定需要哪些頁面和元件
2. **建立元件** → 實作可重用的 UI 元件
3. **建立頁面** → 組合元件形成完整頁面
4. **加入樣式** → 使用 CSS Module 美化介面
5. **測試功能** → 確保元件和頁面正常運作

## 延伸閱讀

- [React 官方文件](https://react.dev/)
- [Docusaurus 頁面系統](https://docusaurus.io/docs/creating-pages)
- [CSS Modules 說明](https://github.com/css-modules/css-modules)
