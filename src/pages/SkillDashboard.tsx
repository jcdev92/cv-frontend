import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';
import { Plus, Edit2, Trash2, Loader2, ArrowLeft, Star } from 'lucide-react';

interface Skill {
  _id?: string;
  name: string;
  category: string;
  proficiency?: number;
}

const SkillDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    proficiency: 50
  });

  const categories = ['Frontend', 'Backend', 'Bases de Datos', 'DevOps / Herramientas', 'Lenguajes', 'Soft Skills', 'Otros'];

  const fetchSkills = useCallback(async () => {
    if (!user?._id) return;
    try {
      const res = await api.get(`/skills?user=${user._id}`);
      setSkills(res.data);
    } catch (error) {
      console.error("Error cargando habilidades:", error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user?._id) return;
    let ignore = false;
    api
      .get(`/skills?user=${user._id}`)
      .then((res) => {
        if (!ignore) setSkills(res.data);
      })
      .catch((error) => console.error("Error cargando habilidades:", error))
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [user]);

  const openForm = (skill?: Skill) => {
    if (skill) {
      setEditingId(skill._id || null);
      setFormData({
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency || 50
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', category: categories[0], proficiency: 50 });
    }
    setIsFormOpen(true);
  };

  const closeForm = () => setIsFormOpen(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'proficiency' ? Number(value) : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      if (editingId) {
        await api.put(`/skills/${editingId}`, formData);
      } else {
        await api.post('/skills', formData);
      }
      setLoading(true);
      await fetchSkills();
      closeForm();
    } catch (error) {
      console.error("Error guardando habilidad:", error);
      alert("Hubo un error al guardar.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar habilidad?')) return;
    try {
      await api.delete(`/skills/${id}`);
      setLoading(true);
      await fetchSkills();
    } catch (error) {
      console.error("Error eliminando habilidad:", error);
      alert("Hubo un error al eliminar.");
    }
  };

  // Agrupar habilidades por categoría
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  if (isFormOpen) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl">
        <button onClick={closeForm} className="flex items-center text-gray-500 hover:text-blue-600 mb-6 transition">
          <ArrowLeft className="h-4 w-4 mr-2" /> Volver
        </button>
        
        <h3 className="text-xl font-bold text-gray-900 mb-6">{editingId ? 'Editar Habilidad' : 'Nueva Habilidad'}</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre de la Herramienta/Habilidad</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Ej: React, Figma, Liderazgo..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select name="category" required value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
              <option value="" disabled>Selecciona una categoría</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nivel de dominio ({formData.proficiency}%)
            </label>
            <input 
              type="range" 
              name="proficiency" 
              min="0" max="100" step="5"
              value={formData.proficiency} 
              onChange={handleChange} 
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
            />
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
          <h3 className="text-xl font-bold text-gray-900">Habilidades (Skills)</h3>
          <p className="text-gray-500 text-sm">Organiza tus herramientas y nivel de experiencia.</p>
        </div>
        <button onClick={() => openForm()} className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition shadow-sm">
          <Plus className="h-4 w-4 mr-2" /> Añadir Habilidad
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="animate-spin text-blue-600 h-8 w-8" /></div>
      ) : skills.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-12 text-center">
          <Star className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">Sin habilidades</h3>
          <p className="text-gray-500 mt-1">Añade los lenguajes o herramientas que dominas.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedSkills).map(([category, catSkills]) => (
            <div key={category} className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm">
              <h4 className="text-md font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">{category}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {catSkills.map((skill) => (
                  <div key={skill._id} className="group relative flex flex-col p-3 rounded-lg border border-gray-100 hover:border-blue-200 bg-gray-50 hover:bg-white transition">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-900">{skill.name}</span>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 absolute right-2 top-2 bg-white/80 rounded p-1">
                        <button onClick={() => openForm(skill)} className="text-gray-400 hover:text-blue-600 transition p-1"><Edit2 className="h-3 w-3" /></button>
                        <button onClick={() => handleDelete(skill._id!)} className="text-gray-400 hover:text-red-600 transition p-1"><Trash2 className="h-3 w-3" /></button>
                      </div>
                    </div>
                    {skill.proficiency && (
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-auto">
                        <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${skill.proficiency}%` }}></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SkillDashboard;
