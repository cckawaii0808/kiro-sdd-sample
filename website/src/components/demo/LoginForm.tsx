import React, { useState } from 'react';
import styles from './LoginForm.module.css';

interface LoginFormProps {
  onLogin: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  onRegister: (email: string, password: string, name: string) => Promise<void>;
}

export default function LoginForm({ onLogin, onRegister }: LoginFormProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await onLogin(email, password, rememberMe);
      } else {
        if (!name) {
          setError('請輸入姓名');
          setLoading(false);
          return;
        }
        await onRegister(email, password, name);
      }
    } catch (err: any) {
      setError(err.message || '操作失敗，請重試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h2>{isLogin ? '登入' : '註冊'}</h2>
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className={styles.formGroup}>
              <label>姓名</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                placeholder="請輸入姓名"
              />
            </div>
          )}

          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="請輸入 email"
            />
          </div>

          <div className={styles.formGroup}>
            <label>密碼</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              placeholder="至少 8 個字元"
            />
          </div>

          {isLogin && (
            <div className={styles.formGroupCheckbox}>
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                記住我（7 天）
              </label>
            </div>
          )}

          {error && <div className={styles.errorMessage}>{error}</div>}

          <button type="submit" disabled={loading} className={styles.btnPrimary}>
            {loading ? '處理中...' : isLogin ? '登入' : '註冊'}
          </button>
        </form>

        <div className={styles.toggleMode}>
          {isLogin ? '還沒有帳號？' : '已經有帳號？'}
          <button onClick={() => setIsLogin(!isLogin)} className={styles.btnLink}>
            {isLogin ? '註冊' : '登入'}
          </button>
        </div>
      </div>
    </div>
  );
}
