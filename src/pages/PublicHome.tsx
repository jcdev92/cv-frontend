import { useAuth } from '../context/AuthContext';

const PublicHome = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-5xl font-bold text-gray-900 mb-6 text-center">Mi Portafolio Público</h1>
      <p className="text-xl text-gray-600 max-w-2xl text-center mb-8">
        Esta será la página que verá todo el mundo. Aquí consumiremos los endpoints GET de la API para mostrar tu CV espectacular.
      </p>
      
      <a 
        href="/admin" 
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition"
      >
        Ir al Panel de Administración
      </a>
    </div>
  );
};

export default PublicHome;
