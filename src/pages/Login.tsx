import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { isAxiosError } from 'axios';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';
import { Briefcase, Loader2 } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.token);
      navigate('/admin');
    } catch (err: unknown) {
      if (isAxiosError<{ message?: string }>(err)) {
        setError(err.response?.data?.message || 'Error al iniciar sesión');
      } else {
        setError('Error al iniciar sesión');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    const demoEmail = import.meta.env.VITE_DEMO_EMAIL;
    const demoPassword = import.meta.env.VITE_DEMO_PASSWORD;
    if (!demoEmail || !demoPassword || loading) return;

    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email: demoEmail,
        password: demoPassword,
      });
      login(response.data.token);
      navigate('/admin');
    } catch (err: unknown) {
      if (isAxiosError<{ message?: string }>(err)) {
        setError(err.response?.data?.message || 'Error al iniciar sesión demo');
      } else {
        setError('Error al iniciar sesión demo');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-page py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="max-w-md w-full space-y-8 bg-surface p-10 rounded-xl shadow-lg border border-line">
        <div className="flex flex-col items-center justify-center">
          <div className="h-12 w-12 bg-accent rounded-lg flex items-center justify-center mb-4 shadow-md">
             <Briefcase className="text-on-accent h-6 w-6" />
          </div>
          <h2 className="text-center text-3xl font-extrabold tracking-wide text-ink">
            RESUMUP
          </h2>
          <p className="mt-1 text-center text-sm font-medium text-muted">
            resume update · mantén tu CV y tu portafolio actualizado
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-danger-soft text-danger p-3 rounded-md text-sm border border-danger-soft text-center">
              {error}
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-ink-soft mb-1">Email</label>
              <input
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 bg-field border border-line-strong placeholder-muted text-ink rounded-md focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink-soft mb-1">Contraseña</label>
              <input
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 bg-field border border-line-strong placeholder-muted text-ink rounded-md focus:outline-none focus:ring-accent focus:border-accent focus:z-10 sm:text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center items-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-on-accent bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:ring-offset-page"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  Iniciando sesión...
                </>
              ) : (
                'Ingresar'
              )}
            </button>
          </div>

          {import.meta.env.VITE_DEMO_EMAIL && import.meta.env.VITE_DEMO_PASSWORD && (
            <div>
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="group relative w-full flex justify-center items-center py-2.5 px-4 border border-accent-soft text-sm font-medium rounded-md text-accent bg-accent-soft hover:bg-accent-soft focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:ring-offset-page"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Entrar como invitado (Demo)'
                )}
              </button>
              <p className="mt-2 text-center text-xs text-muted">
                {import.meta.env.VITE_DEMO_EMAIL} · prueba el panel y edita libremente
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
