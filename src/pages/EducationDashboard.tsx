import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';
import { Plus, Edit2, Trash2, Calendar, MapPin, Loader2, ArrowLeft, GraduationCap, Building2 } from 'lucide-react';

interface Education {
  _id?: string;
  degree: string;
  institution: string;
  location?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
}

const EducationDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    degree: '',
    institution: '',
    location: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: ''
  });

  const fetchEducations = async () => {
    if (!user?._id) return;
    setLoading(true);
    try {
      const res = await api.get(`/educations?user=${user._id}`);
      setEducations(res.data);
    } catch (error) {
      console.error("Error cargando educación:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducations();
  }, [user]);

  const openForm = (edu?: Education) => {
    if (edu) {
      setEditingId(edu._id || null);
      setFormData({
        degree: edu.degree,
        institution: edu.institution,
        location: edu.location || '',
        startDate: edu.startDate ? edu.startDate.substring(0, 10) : '',
        endDate: edu.endDate ? edu.endDate.substring(0, 10) : '',
        isCurrent: edu.isCurrent,
        description: edu.description || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        degree: '', institution: '', location: '', startDate: '', endDate: '',
        isCurrent: false, description: ''
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
    
    const payload = {
      ...formData,
      endDate: formData.isCurrent ? null : formData.endDate
    };

    try {
      if (editingId) {
        await api.put(`/educations/${editingId}`, payload);
      } else {
        await api.post('/educations', payload);
      }
      await fetchEducations();
      closeForm();
    } catch (error) {
      console.error("Error guardando educación:", error);
      alert("Hubo un error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este registro?')) return;
    try {
      await api.delete(`/educations/${id}`);
      await fetchEducations();
    } catch (error) {
      console.error("Error eliminando educación:", error);
      alert("Hubo un error al eliminar.");
    }
  };

  if (isFormOpen) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-4xl">
        <button onClick={closeForm} className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition">
          <ArrowLeft className="h-4 w-4 mr-2" /> Volver a la lista
        </button>
        
        <h3 className="text-xl font-bold text-gray-900 mb-6">{editingId ? 'Editar Educación' : 'Nueva Educación'}</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Título / Grado</label>
              <input type="text" name="degree" required value={formData.degree} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Ej: Ingeniería Informática" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Institución</label>
              <input type="text" name="institution" required value={formData.institution} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ubicación</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Ej: Madrid, España" />
            </div>
            <div className="flex items-center mt-6">
              <input type="checkbox" name="isCurrent" id="isCurrent" checked={formData.isCurrent} onChange={handleChange} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
              <label htmlFor="isCurrent" className="ml-2 block text-sm text-gray-900">Estudio aquí actualmente</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (Opcional)</label>
            <textarea name="description" rows={3} value={formData.description} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Menciones honoríficas, proyectos destacados..." />
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
          <h3 className="text-xl font-bold text-gray-900">Educación</h3>
          <p className="text-gray-500 text-sm">Gestiona tu historial académico y certificaciones.</p>
        </div>
        <button onClick={() => openForm()} className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition shadow-sm">
          <Plus className="h-4 w-4 mr-2" /> Añadir Educación
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-600 h-8 w-8" /></div>
      ) : educations.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
          <GraduationCap className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No hay educación registrada</h3>
          <p className="text-gray-500 mt-1">Añade tus títulos universitarios o cursos relevantes.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {educations.map((edu) => (
            <div key={edu._id} className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-bold text-gray-900">{edu.degree}</h4>
                  <div className="flex flex-wrap items-center text-sm text-gray-600 mt-1 gap-4">
                    <span className="flex items-center"><Building2 className="h-4 w-4 mr-1 text-gray-400" /> {edu.institution}</span>
                    {edu.location && <span className="flex items-center"><MapPin className="h-4 w-4 mr-1 text-gray-400" /> {edu.location}</span>}
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" /> 
                      {new Date(edu.startDate).toLocaleDateString()} - {edu.isCurrent ? 'Actualidad' : (edu.endDate ? new Date(edu.endDate).toLocaleDateString() : 'N/A')}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => openForm(edu)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition" title="Editar">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(edu._id!)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition" title="Eliminar">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {edu.description && <p className="text-gray-700 mt-4 text-sm">{edu.description}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EducationDashboard;
