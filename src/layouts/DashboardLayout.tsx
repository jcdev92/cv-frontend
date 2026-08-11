import { useState } from 'react';
import { Link, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, LayoutDashboard, UserCircle, Briefcase, GraduationCap, Code, Star, Menu, X, Eye, FileText, KeyRound } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

const DashboardLayout = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
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
    { name: 'Contraseña', icon: KeyRound, path: '/admin/change-password' },
  ];

  return (
    <div className="flex h-screen bg-page flex-col md:flex-row">

      {/* Header móvil */}
      <div className="md:hidden flex items-center justify-between bg-surface border-b border-line px-4 py-3 z-20">
        <div className="flex items-center">
          <LayoutDashboard className="h-6 w-6 text-accent mr-2" />
          <h1 className="text-lg font-extrabold tracking-wide text-ink">RESUMUP</h1>
        </div>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="text-muted hover:text-ink focus:outline-none"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Overlay oscuro para móvil */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-overlay z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar (fija en PC, deslizable en móvil) */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-surface border-r border-line flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 hidden md:flex items-center px-6 border-b border-line">
          <LayoutDashboard className="h-6 w-6 text-accent mr-2 shrink-0" />
          <div className="min-w-0 leading-tight">
            <h1 className="text-lg font-extrabold tracking-wide text-ink">RESUMUP</h1>
            <p className="text-[11px] font-medium text-faint truncate">resume update</p>
          </div>
        </div>

        {/* Botón cerrar en móvil */}
        <div className="md:hidden flex items-center justify-end px-4 py-4 border-b border-line">
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-muted hover:text-danger">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)} // Cerrar menú al hacer clic en móvil
              className="flex items-center px-2 py-2.5 text-sm font-medium rounded-md text-ink-soft hover:text-accent hover:bg-accent-soft transition-colors"
            >
              <item.icon className="mr-3 h-5 w-5 text-faint" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="px-4 pb-4">
          <Link
            to={user?.email ? `/?user=${user.email}` : "/"}
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center px-2 py-2.5 text-sm font-medium rounded-md text-accent bg-accent-soft hover:bg-accent-soft transition-colors"
          >
            <Eye className="mr-3 h-5 w-5" />
            Ver Portafolio
          </Link>
        </div>

        <div className="p-4 border-t border-line">
          <button
            onClick={logout}
            className="flex items-center w-full px-2 py-2 text-sm font-medium text-danger rounded-md hover:bg-danger-soft transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto flex flex-col relative z-0">
        <header className="hidden md:flex h-16 bg-surface border-b border-line items-center px-8 shrink-0">
          <h2 className="text-xl font-semibold text-ink-soft">Panel de Control</h2>
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
