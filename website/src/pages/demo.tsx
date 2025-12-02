import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import CalculatorDemo from '@site/src/components/demo/CalculatorDemo';
import LoginForm from '@site/src/components/demo/LoginForm';

const API_URL = 'http://localhost:3001/api';

export default function DemoPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('demo_token');
    if (token) {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('demo_token');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
      }
    }
    setLoading(false);
  };

  const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, rememberMe }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || '登入失敗');
    }

    const data = await res.json();
    localStorage.setItem('demo_token', data.token);
    setUser(data.user);
    setIsAuthenticated(true);
  };

  const handleRegister = async (email: string, password: string, name: string) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || '註冊失敗');
    }

    const data = await res.json();
    localStorage.setItem('demo_token', data.token);
    setUser(data.user);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('demo_token');
    setUser(null);
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <Layout title="互動式 Demo" description="體驗登入計算機功能">
        <div style={{ padding: '4rem 0', textAlign: 'center' }}>
          <p>載入中...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="互動式 Demo" description="體驗登入計算機功能">
      <div style={{ padding: '2rem 0' }}>
        <div className="container">
          <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>
            登入計算機 Demo
          </h1>
          <p style={{ textAlign: 'center', color: '#666', marginBottom: '2rem' }}>
            {isAuthenticated 
              ? `歡迎回來，${user?.name}！` 
              : '請先登入或註冊以使用計算機'}
          </p>

          {!isAuthenticated ? (
            <>
              <LoginForm onLogin={handleLogin} onRegister={handleRegister} />
              <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '1rem', background: '#f0f8ff', borderRadius: '8px' }}>
                <h3 style={{ marginTop: 0 }}>💡 提示</h3>
                <p>這是一個完整的登入計算機範例，包含：</p>
                <ul>
                  <li>用戶註冊和登入（JWT 認證）</li>
                  <li>計算機功能</li>
                  <li>計算歷史記錄（保存到後端）</li>
                </ul>
                <p style={{ marginBottom: 0 }}>
                  <strong>注意：</strong>需要先啟動後端 API（<code>cd backend && npm run dev</code>）
                </p>
              </div>
            </>
          ) : (
            <>
              <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                <button 
                  onClick={handleLogout}
                  style={{
                    padding: '0.5rem 1.5rem',
                    background: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                  }}
                >
                  登出
                </button>
              </div>
              <CalculatorDemo />
            </>
          )}
          
          <div style={{ maxWidth: '800px', margin: '3rem auto', padding: '0 1rem' }}>
            <h2>關於這個 Demo</h2>
            <p>這個登入計算機展示了完整的規格驅動開發流程：</p>
            <ol>
              <li><strong>定義規格</strong>：在 <code>docs/spec.md</code> 定義功能需求</li>
              <li><strong>生成計畫</strong>：Kiro 自動拆解成開發任務</li>
              <li><strong>實作功能</strong>：前後端 + 測試一起開發</li>
              <li><strong>測試驗證</strong>：確保符合規格要求</li>
            </ol>
            
            <h3>技術棧</h3>
            <ul>
              <li><strong>後端</strong>：Express + TypeScript + JWT</li>
              <li><strong>前端</strong>：React + TypeScript</li>
              <li><strong>測試</strong>：Jest + Supertest（覆蓋率 &gt; 80%）</li>
              <li><strong>資料庫</strong>：記憶體資料庫（示範用）</li>
            </ul>

            <h3>完整專案</h3>
            <p>
              想要看完整的原始碼和教學？
              查看 <a href="/docs/examples/login-calculator-tutorial">完整教學文件</a>。
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
