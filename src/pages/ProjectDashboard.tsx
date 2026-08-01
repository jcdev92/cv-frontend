import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';
import { Plus, Edit2, Trash2, Loader2, ArrowLeft, Code, ExternalLink, Github, ImageIcon } from 'lucide-react';

interface Project {
  _id?: string;
  title: string;
  description: string;
  imageUrl?: string;
  repoUrl?: string;
  liveUrl?: string;
  technologies: string[];
  startDate?: string;
  endDate?: string;
  highlights?: string[];
}

const ProjectDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    repoUrl: '',
    liveUrl: '',
    startDate: '',
    endDate: '',
    highlights: '',
    technologies: ''
  });

  const fetchProjects = useCallback(async () => {
    if (!user?._id) return;
    try {
      const res = await api.get(`/projects?user=${user._id}`);
      setProjects(res.data);
    } catch (error) {
      console.error("Error cargando proyectos:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user?._id) return;
    let ignore = false;
    api
      .get(`/projects?user=${user._id}`)
      .then((res) => {
        if (!ignore) setProjects(res.data);
      })
      .catch((error) => console.error("Error cargando proyectos:", error))
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [user]);

  const openForm = (proj?: Project) => {
    if (proj) {
      setEditingId(proj._id || null);
      setFormData({
        title: proj.title,
        description: proj.description,
        imageUrl: proj.imageUrl || '',
        repoUrl: proj.repoUrl || '',
        liveUrl: proj.liveUrl || '',
        startDate: proj.startDate ? proj.startDate.substring(0, 10) : '',
        endDate: proj.endDate ? proj.endDate.substring(0, 10) : '',
        highlights: proj.highlights ? proj.highlights.join('\n') : '',
        technologies: proj.technologies ? proj.technologies.join(', ') : ''
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '', description: '', imageUrl: '', repoUrl: '', liveUrl: '',
        startDate: '', endDate: '', highlights: '', technologies: ''
      });
    }
    setIsFormOpen(true);
  };

  const closeForm = () => setIsFormOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    const payload = {
      ...formData,
      highlights: formData.highlights.split('\n').filter(h => h.trim() !== ''),
      technologies: formData.technologies.split(',').map(t => t.trim()).filter(t => t !== ''),
      startDate: formData.startDate || null,
      endDate: formData.endDate || null,
    };

    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, payload);
      } else {
        await api.post('/projects', payload);
      }
      setLoading(true);
      await fetchProjects();
      closeForm();
    } catch (error) {
      console.error("Error guardando proyecto:", error);
      alert("Hubo un error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este proyecto?')) return;
    try {
      await api.delete(`/projects/${id}`);
      setLoading(true);
      await fetchProjects();
    } catch (error) {
      console.error("Error eliminando proyecto:", error);
      alert("Hubo un error al eliminar.");
    }
  };

  if (isFormOpen) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-4xl">
        <button onClick={closeForm} className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition">
          <ArrowLeft className="h-4 w-4 mr-2" /> Volver a la lista
        </button>
        
        <h3 className="text-xl font-bold text-gray-900 mb-6">{editingId ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Título del Proyecto</label>
              <input type="text" name="title" required value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Repositorio (URL de GitHub)</label>
              <input type="url" name="repoUrl" value={formData.repoUrl} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="https://github.com/..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sitio en Vivo (URL)</label>
              <input type="url" name="liveUrl" value={formData.liveUrl} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="https://..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">URL de la Imagen / Captura</label>
              <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="https://..." />
            </div>
            
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Inicio (Opcional)</label>
                <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Fin (Opcional)</label>
                <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <textarea name="description" required rows={3} value={formData.description} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="¿De qué trata este proyecto?" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Características / Logros (Uno por línea)</label>
            <textarea name="highlights" rows={3} value={formData.highlights} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="- Autenticación de usuarios&#10;- Integración con pasarela de pagos..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tecnologías (Separadas por comas)</label>
            <input type="text" name="technologies" value={formData.technologies} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="React, Node.js, MongoDB..." />
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

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Proyectos / Portafolio</h3>
          <p className="text-gray-500 text-sm">Gestiona los proyectos que se mostrarán en tu portafolio.</p>
        </div>
        <button onClick={() => openForm()} className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition shadow-sm">
          <Plus className="h-4 w-4 mr-2" /> Añadir Proyecto
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-600 h-8 w-8" /></div>
      ) : projects.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
          <Code className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No hay proyectos</h3>
          <p className="text-gray-500 mt-1">Añade proyectos para construir tu portafolio.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <div key={proj._id} className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col">
              {proj.imageUrl ? (
                <div className="h-40 w-full overflow-hidden">
                  <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-40 w-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <ImageIcon className="h-10 w-10 opacity-50" />
                </div>
              )}
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-bold text-gray-900 line-clamp-1">{proj.title}</h4>
                  <div className="flex space-x-1 ml-2">
                    <button onClick={() => openForm(proj)} className="p-1 text-gray-400 hover:text-blue-600 rounded transition" title="Editar">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(proj._id!)} className="p-1 text-gray-400 hover:text-red-600 rounded transition" title="Eliminar">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">{proj.description}</p>
                
                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {proj.technologies.slice(0, 4).map((tech, i) => (
                      <span key={i} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded border border-blue-100">
                        {tech}
                      </span>
                    ))}
                    {proj.technologies.length > 4 && <span className="text-xs text-gray-500">+{proj.technologies.length - 4}</span>}
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-100 flex space-x-4">
                  {proj.repoUrl && (
                    <a href={proj.repoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-gray-600 hover:text-gray-900">
                      <Github className="h-4 w-4 mr-1.5" /> Código
                    </a>
                  )}
                  {proj.liveUrl && (
                    <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                      <ExternalLink className="h-4 w-4 mr-1.5" /> Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectDashboard;
