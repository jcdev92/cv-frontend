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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-950">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg border border-gray-100 dark:bg-gray-900 dark:border-gray-700">
        <div className="flex flex-col items-center justify-center">
          <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4 shadow-md">
             <Briefcase className="text-white h-6 w-6" />
          </div>
          <h2 className="text-center text-3xl font-extrabold tracking-wide text-gray-900 dark:text-gray-100">
            RESUMUP
          </h2>
          <p className="mt-1 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
            resume update · mantén tu CV y tu portafolio actualizado
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm border border-red-100 text-center dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20">
              {error}
            </div>
          )}

          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Email</label>
              <input
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 bg-white border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-100"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">Contraseña</label>
              <input
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-2 bg-white border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-gray-100"
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
              className="group relative w-full flex justify-center items-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed dark:focus:ring-offset-gray-900"
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
                className="group relative w-full flex justify-center items-center py-2.5 px-4 border border-blue-200 text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed dark:border-blue-500/30 dark:text-blue-400 dark:bg-blue-500/10 dark:hover:bg-blue-500/20 dark:focus:ring-offset-gray-900"
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
              <p className="mt-2 text-center text-xs text-gray-500 dark:text-gray-400">
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
