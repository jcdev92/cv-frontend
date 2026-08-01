import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, LayoutDashboard, UserCircle, Briefcase, GraduationCap, Code, Star, Menu, X } from 'lucide-react';

const DashboardLayout = () => {
  const { isAuthenticated, logout } = useAuth();
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
  ];

  return (
    <div className="flex h-screen bg-gray-50 flex-col md:flex-row">
      
      {/* Header móvil */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 py-3 z-20">
        <div className="flex items-center">
          <LayoutDashboard className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-lg font-bold text-gray-900">Admin CV</h1>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="text-gray-500 hover:text-gray-900 focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>
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
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 hidden md:flex items-center px-6 border-b border-gray-200">
          <LayoutDashboard className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-lg font-bold text-gray-900">Admin CV</h1>
        </div>
        
        {/* Botón cerrar en móvil */}
        <div className="md:hidden flex items-center justify-end px-4 py-4 border-b border-gray-100">
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 hover:text-red-500">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.path}
              onClick={() => setIsMobileMenuOpen(false)} // Cerrar menú al hacer clic en móvil
              className="flex items-center px-2 py-2.5 text-sm font-medium rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <item.icon className="mr-3 h-5 w-5 text-gray-400" />
              {item.name}
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center w-full px-2 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto flex flex-col relative z-0">
        <header className="hidden md:flex h-16 bg-white border-b border-gray-200 items-center px-8 shrink-0">
          <h2 className="text-xl font-semibold text-gray-800">Panel de Control</h2>
        </header>
        <main className="p-4 md:p-8 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
