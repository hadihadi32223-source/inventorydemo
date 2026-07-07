import { FormEvent, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { LockKeyhole, LogIn, UserRound } from 'lucide-react';
import { useAuth } from '../auth/AuthContext';

export default function Login() {
  const { isAuthenticated, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/';

  if (isAuthenticated) return <Navigate to="/" replace />;


  const demoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await login('admin', 'admin123');
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر تشغيل النسخة التجريبية');
    } finally {
      setLoading(false);
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذر تسجيل الدخول');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="classic-login-shell" dir="rtl">
      <div className="classic-titlebar login-titlebar">
        <div className="classic-window-controls" aria-hidden="true"><span>×</span><span>□</span><span>−</span></div>
        <div className="classic-title-text">C:\ArabicWms\Login.exe - تسجيل الدخول</div>
        <div className="classic-title-logo">WMS</div>
      </div>

      <form className="classic-login-card" onSubmit={submit}>
        <div className="classic-form-titlebar login-form-title"><span>تسجيل الدخول إلى نظام إدارة المخزون والمستودعات</span></div>
        <div className="classic-login-body">
          <div className="classic-login-logo"><LockKeyhole size={44} /><span>ArabicWms</span></div>
          <label className="classic-login-field">
            <span>اسم المستخدم</span>
            <div><UserRound size={15} /><input value={username} onChange={(e) => setUsername(e.target.value)} autoFocus /></div>
          </label>
          <label className="classic-login-field">
            <span>كلمة المرور</span>
            <div><LockKeyhole size={15} /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
          </label>
          {error && <div className="classic-login-error">{error}</div>}
          <button className="classic-login-btn" disabled={loading} type="submit"><LogIn size={17} />{loading ? 'جاري الدخول...' : 'دخول'}</button>
          <button className="classic-login-btn demo-login-btn" disabled={loading} type="button" onClick={demoLogin}>
            <LogIn size={17} /> الدخول إلى النسخة التجريبية
          </button>
          <div className="classic-login-help">
            نسخة عرض للعميل تعمل ببيانات محلية آمنة دون Backend. يمكن الدخول مباشرة لمعاينة النظام بالكامل.
          </div>
        </div>
      </form>
    </div>
  );
}
