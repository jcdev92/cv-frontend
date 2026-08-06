import { useState } from 'react';
import { Link, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, LayoutDashboard, UserCircle, Briefcase, GraduationCap, Code, Star, Menu, X, Eye, FileText } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

const DashboardLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { name: 'Perfil', icon: UserCircle, path: '/admin' },
    { name: 'Experiencia', icon: Briefcase, path: '/admin/experiences' },
    { name: 'Educación', icon: GraduationCap, path: '/admin/education' },
    { name: 'Proyectos', icon: Code, path: '/admin/projects' },
    { name: 'Habilidades', icon: Star, path: '/admin/skills' },
    { name: 'CV / Currículum', icon: FileText, path: '/admin/cv' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 flex-col md:flex-row dark:bg-gray-950">

      {/* Header móvil */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 z-20 dark:bg-gray-900 dark:border-gray-700">
        <div className="flex items-center">
          <LayoutDashboard className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Admin CV</h1>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-gray-500 hover:text-gray-900 focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Overlay oscuro para móvil */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (fija en PC, deslizable en móvil) */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200 flex flex-col
        transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        dark:bg-gray-900 dark:border-gray-700
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 hidden md:flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
          <LayoutDashboard className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Admin CV</h1>
        </div>

        {/* Botón cerrar en móvil */}
        <div className="md:hidden flex items-center justify-end px-4 py-4 border-b border-gray-100 dark:border-gray-700">
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-red-500 dark:text-gray-400">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.path}
              onClick={() => setIsMobileMenuOpen(false)} // Cerrar menú al hacer clic en móvil
              className="flex items-center px-2 py-2.5 text-sm font-medium rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-blue-500/10"
            >
              <item.icon className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
              {item.name}
            </a>
          ))}
        </nav>

        <div className="px-4 pb-4">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center px-2 py-2.5 text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 transition-colors dark:text-blue-400 dark:bg-blue-500/10 dark:hover:bg-blue-500/20"
          >
            <Eye className="mr-3 h-5 w-5" />
            Ver Portafolio
          </Link>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={logout}
            className="flex items-center w-full px-2 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors dark:hover:bg-red-500/10"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto flex flex-col relative z-0">
        <header className="hidden md:flex h-16 bg-white border-b border-gray-200 items-center px-8 shrink-0 dark:bg-gray-900 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Panel de Control</h2>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>
        <main className="p-4 md:p-8 flex-1">
          <div className="w-full max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
