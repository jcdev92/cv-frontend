import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';
import { Plus, Edit2, Trash2, Calendar, Building, Briefcase, MapPin, Loader2, ArrowLeft } from 'lucide-react';

// Interfaz para el tipado de la experiencia
interface Experience {
  _id?: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  highlights: string[];
  technologies: string[];
}

const ExperienceDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Estado del formulario adaptado para inputs de texto plano
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    location: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    highlights: '', // Lo manejaremos como texto separado por saltos de línea
    technologies: '' // Lo manejaremos como texto separado por comas
  });

  const fetchExperiences = useCallback(async () => {
    if (!user?._id) return;
    try {
      const res = await api.get(`/experiences?user=${user._id}`);
      setExperiences(res.data);
    } catch (error) {
      console.error("Error cargando experiencias:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user?._id) return;
    let ignore = false;
    api
      .get(`/experiences?user=${user._id}`)
      .then((res) => {
        if (!ignore) setExperiences(res.data);
      })
      .catch((error) => console.error("Error cargando experiencias:", error))
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [user]);

  const openForm = (exp?: Experience) => {
    if (exp) {
      setEditingId(exp._id || null);
      setFormData({
        jobTitle: exp.jobTitle,
        company: exp.company,
        location: exp.location || '',
        startDate: exp.startDate ? exp.startDate.substring(0, 10) : '',
        endDate: exp.endDate ? exp.endDate.substring(0, 10) : '',
        isCurrent: exp.isCurrent,
        description: exp.description,
        highlights: exp.highlights.join('\n'),
        technologies: exp.technologies.join(', ')
      });
    } else {
      setEditingId(null);
      setFormData({
        jobTitle: '', company: '', location: '', startDate: '', endDate: '',
        isCurrent: false, description: '', highlights: '', technologies: ''
      });
    }
    setIsFormOpen(true);
  };

  const closeForm = () => setIsFormOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Transformar textos a arreglos para la API
    const payload = {
      ...formData,
      highlights: formData.highlights.split('\n').filter(h => h.trim() !== ''),
      technologies: formData.technologies.split(',').map(t => t.trim()).filter(t => t !== ''),
      endDate: formData.isCurrent ? null : formData.endDate
    };

    try {
      if (editingId) {
        await api.put(`/experiences/${editingId}`, payload);
      } else {
        await api.post('/experiences', payload);
      }
      setLoading(true);
      await fetchExperiences();
      closeForm();
    } catch (error) {
      console.error("Error guardando experiencia:", error);
      alert("Hubo un error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar esta experiencia?')) return;
    try {
      await api.delete(`/experiences/${id}`);
      setLoading(true);
      await fetchExperiences();
    } catch (error) {
      console.error("Error eliminando experiencia:", error);
      alert("Hubo un error al eliminar.");
    }
  };

  // --- Render del Formulario ---
  if (isFormOpen) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-4xl">
        <button onClick={closeForm} className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition">
          <ArrowLeft className="h-4 w-4 mr-2" /> Volver a la lista
        </button>
        
        <h3 className="text-xl font-bold text-gray-900 mb-6">{editingId ? 'Editar Experiencia' : 'Nueva Experiencia'}</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cargo / Puesto</label>
              <input type="text" name="jobTitle" required value={formData.jobTitle} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
              <input type="text" name="company" required value={formData.company} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Ej: Madrid, Remoto..." />
            </div>
            <div className="flex items-center mt-6">
              <input type="checkbox" name="isCurrent" id="isCurrent" checked={formData.isCurrent} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <label htmlFor="isCurrent" className="ml-2 block text-sm text-gray-900">Trabajo aquí actualmente</label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Inicio</label>
              <input type="date" name="startDate" required value={formData.startDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            {!formData.isCurrent && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de Fin</label>
                <input type="date" name="endDate" required={!formData.isCurrent} value={formData.endDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción general</label>
            <textarea name="description" required rows={3} value={formData.description} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Describe brevemente tus responsabilidades..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Logros destacados (Un logro por línea)</label>
            <textarea name="highlights" rows={4} value={formData.highlights} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="- Mejoré el rendimiento en un 20%&#10;- Lideré un equipo de 5 personas..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tecnologías utilizadas (Separadas por comas)</label>
            <input type="text" name="technologies" value={formData.technologies} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="React, Node.js, TypeScript, Docker..." />
          </div>

          <div className="flex justify-end pt-4">
            <button type="button" onClick={closeForm} className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition">Cancelar</button>
            <button type="submit" disabled={saving} className="flex items-center px-6 py-2.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-70 transition">
              {saving && <Loader2 className="animate-spin mr-2 h-4 w-4" />} Guardar
            </button>
          </div>
        </form>
      </div>
    );
  }

  // --- Render de la Lista ---
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Experiencia Laboral</h3>
          <p className="text-gray-500 text-sm">Gestiona tu historial de trabajos y proyectos empresariales.</p>
        </div>
        <button onClick={() => openForm()} className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition shadow-sm">
          <Plus className="h-4 w-4 mr-2" /> Añadir Experiencia
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-600 h-8 w-8" /></div>
      ) : experiences.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
          <Briefcase className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No hay experiencias</h3>
          <p className="text-gray-500 mt-1">Comienza agregando tu trabajo más reciente.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div key={exp._id} className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{exp.jobTitle}</h4>
                  <div className="flex flex-wrap items-center text-sm text-gray-600 mt-1 gap-4">
                    <span className="flex items-center"><Building className="h-4 w-4 mr-1 text-gray-400" /> {exp.company}</span>
                    <span className="flex items-center"><MapPin className="h-4 w-4 mr-1 text-gray-400" /> {exp.location}</span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" /> 
                      {new Date(exp.startDate).toLocaleDateString()} - {exp.isCurrent ? 'Actualidad' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'N/A')}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => openForm(exp)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition" title="Editar">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(exp._id!)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition" title="Eliminar">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-700 mt-4 text-sm">{exp.description}</p>
              
              {exp.technologies && exp.technologies.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {exp.technologies.map((tech, i) => (
                    <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full border border-gray-200">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceDashboard;
