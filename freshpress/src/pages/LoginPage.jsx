import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './LoginPage.module.css';

export function LoginPage() {
  const { login, authError } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 400)); // UX delay
    login(username, password);
    setLoading(false);
  }

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <div className={styles.leftInner}>
          <div className={styles.brand}>
            <div className={styles.logoMark}>FP</div>
            <span className={styles.brandName}>FreshPress</span>
          </div>
          <h1 className={styles.hero}>Clean clothes,<br /><em>happy customers.</em></h1>
          <p className={styles.tagline}>Laundry management for the modern dry cleaner.</p>
          <div className={styles.demoHint}>
            <span className={styles.demoLabel}>Demo credentials</span>
            <div className={styles.demoRow}><span>admin</span><span>admin123</span></div>
            <div className={styles.demoRow}><span>staff</span><span>staff123</span></div>
          </div>
        </div>
      </div>

      <div className={styles.right}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formHead}>
            <h2 className={styles.formTitle}>Sign in</h2>
            <p className={styles.formSub}>Enter your credentials to continue</p>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Username</label>
            <input
              className={styles.input}
              placeholder="e.g. admin"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
              autoComplete="username"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          {authError && <div className={styles.errorBox}>{authError}</div>}

          <button
            className={styles.submitBtn}
            type="submit"
            disabled={loading || !username || !password}
          >
            {loading ? <span className={styles.spinner} /> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
