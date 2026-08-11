import type { Skill } from '../types/cv';
import { useAuthStore } from '../store/authStore';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';
import { useCrudResource } from '../hooks/useCrudResource';
import { useForm } from '../hooks/useForm';
import {
  Input, Select, Button, IconButton, EmptyState,
  SectionHeader, FormActions, BackButton, ErrorBanner, DashboardSkeleton,
} from '../components/admin/ui';
import { useColdStart } from '../hooks/useColdStart';

interface SkillForm {
  name: string;
  category: string;
  proficiency: number;
}

const categories = ['Frontend', 'Backend', 'Bases de Datos', 'DevOps / Herramientas', 'Lenguajes', 'Soft Skills', 'Otros'];

const SkillDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const { formData, setFormData, handleChange, reset } = useForm<SkillForm>({
    name: '',
    category: categories[0],
    proficiency: 50,
  });
  const { items: skills, loading, saving, isFormOpen, editingId, error, openForm, closeForm, save, remove, clearError } =
    useCrudResource<Skill, SkillForm>('/skills', user?._id, {
      deleteConfirmMessage: '¿Eliminar habilidad?',
    });

  const showColdStartMessage = useColdStart(loading);

  const handleNew = () => {
    reset();
    openForm();
  };

  const handleEdit = (skill: Skill) => {
    setFormData({
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency || 50,
    });
    openForm(skill);
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    save(formData);
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = [];
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  if (isFormOpen) {
    return (
      <div className="bg-surface p-6 rounded-xl shadow-sm border border-line max-w-2xl">
        <BackButton onClick={closeForm} label="Volver" />
        <h3 className="text-xl font-bold text-ink mb-6">{editingId ? 'Editar Habilidad' : 'Nueva Habilidad'}</h3>
        {error && <ErrorBanner message={error} onDismiss={clearError} />}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input label="Nombre de la Herramienta/Habilidad" name="name" required value={formData.name} onChange={handleChange} placeholder="Ej: React, Figma, Liderazgo..." />
          <Select label="Categoría" name="category" required value={formData.category} onChange={handleChange}>
            <option value="" disabled>Selecciona una categoría</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1">
              Nivel de dominio ({formData.proficiency}%)
            </label>
            <input
              type="range"
              name="proficiency"
              min="0" max="100" step="5"
              value={formData.proficiency}
              onChange={(e) => setFormData((prev) => ({ ...prev, proficiency: Number(e.target.value) }))}
              className="w-full h-2 bg-surface-soft rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>
          <FormActions onCancel={closeForm} saving={saving} />
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Habilidades (Skills)"
        subtitle="Organiza tus herramientas y nivel de experiencia."
        action={
          <Button size="sm" onClick={handleNew}>
            <Plus className="h-4 w-4 mr-2" /> Añadir Habilidad
          </Button>
        }
      />

      {error && <ErrorBanner message={error} onDismiss={clearError} />}

      {loading ? (
        <DashboardSkeleton showColdStartMessage={showColdStartMessage} variant="list" />
      ) : skills.length === 0 ? (
        <EmptyState icon={Star} title="Sin habilidades" description="Añade los lenguajes o herramientas que dominas." />
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedSkills).map(([category, catSkills]) => (
            <div key={category} className="bg-surface border border-line p-5 rounded-xl shadow-sm">
              <h4 className="text-md font-bold text-ink mb-4 border-b border-line pb-2">
                {category}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {catSkills.map((skill) => (
                  <div key={skill._id} className="group relative flex flex-col p-3 rounded-lg border border-line hover:border-accent bg-surface-soft hover:bg-surface transition">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-ink">{skill.name}</span>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 absolute right-2 top-2 bg-surface/80 rounded p-1">
                        <IconButton onClick={() => handleEdit(skill)} className="p-1 text-faint hover:text-accent">
                          <Edit2 className="h-3 w-3" />
                        </IconButton>
                        <IconButton onClick={() => remove(skill._id)} className="p-1 text-faint hover:text-danger">
                          <Trash2 className="h-3 w-3" />
                        </IconButton>
                      </div>
                    </div>
                    {skill.proficiency && (
                      <div className="w-full bg-surface-soft rounded-full h-1.5 mt-auto">
                        <div className="bg-accent h-1.5 rounded-full" style={{ width: `${skill.proficiency}%` }}></div>
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
