import type { Experience } from '../types/cv';
import { useAuthStore } from '../store/authStore';
import { Plus, Edit2, Trash2, Calendar, Building, Briefcase, MapPin } from 'lucide-react';
import { useCrudResource } from '../hooks/useCrudResource';
import { useForm } from '../hooks/useForm';
import {
  Input, Textarea, Checkbox, Button, IconButton, EmptyState,
  SectionHeader, FormActions, BackButton, ErrorBanner, DashboardSkeleton,
} from '../components/admin/ui';
import { useColdStart } from '../hooks/useColdStart';

interface ExperienceForm {
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  highlights: string;
  technologies: string;
}

const initialForm: ExperienceForm = {
  jobTitle: '',
  company: '',
  location: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  description: '',
  highlights: '',
  technologies: '',
};

const ExperienceDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const { formData, setFormData, handleChange, reset } = useForm(initialForm);
  const { items: experiences, loading, saving, isFormOpen, editingId, error, openForm, closeForm, save, remove, clearError } =
    useCrudResource<Experience, ExperienceForm>('/experiences', user?._id, {
      transformPayload: (fd) => ({
        ...fd,
        highlights: fd.highlights.split('\n').filter((h) => h.trim() !== ''),
        technologies: fd.technologies.split(',').map((t) => t.trim()).filter((t) => t !== ''),
        endDate: fd.isCurrent ? null : fd.endDate,
      }),
      deleteConfirmMessage: '¿Estás seguro de que deseas eliminar esta experiencia?',
    });

  const showColdStartMessage = useColdStart(loading);

  const handleNew = () => {
    reset();
    openForm();
  };

  const handleEdit = (exp: Experience) => {
    setFormData({
      jobTitle: exp.jobTitle,
      company: exp.company,
      location: exp.location || '',
      startDate: exp.startDate ? exp.startDate.substring(0, 10) : '',
      endDate: exp.endDate ? exp.endDate.substring(0, 10) : '',
      isCurrent: exp.isCurrent,
      description: exp.description,
      highlights: exp.highlights.join('\n'),
      technologies: exp.technologies.join(', '),
    });
    openForm(exp);
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    save(formData);
  };

  if (isFormOpen) {
    return (
      <div className="bg-surface p-6 rounded-xl shadow-sm border border-line">
        <BackButton onClick={closeForm} />
        <h3 className="text-xl font-bold text-ink mb-6">{editingId ? 'Editar Experiencia' : 'Nueva Experiencia'}</h3>
        {error && <ErrorBanner message={error} onDismiss={clearError} />}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Cargo / Puesto" name="jobTitle" required value={formData.jobTitle} onChange={handleChange} />
            <Input label="Empresa" name="company" required value={formData.company} onChange={handleChange} />
            <Input label="Ubicación" name="location" value={formData.location} onChange={handleChange} placeholder="Ej: Madrid, Remoto..." />
            <Checkbox id="isCurrent" name="isCurrent" label="Trabajo aquí actualmente" checked={formData.isCurrent} onChange={handleChange} />
            <Input label="Fecha de Inicio" type="date" name="startDate" required value={formData.startDate} onChange={handleChange} />
            {!formData.isCurrent && (
              <Input label="Fecha de Fin" type="date" name="endDate" required value={formData.endDate} onChange={handleChange} />
            )}
          </div>
          <Textarea label="Descripción general" name="description" required rows={3} value={formData.description} onChange={handleChange} placeholder="Describe brevemente tus responsabilidades..." />
          <Textarea label="Logros destacados (Un logro por línea)" name="highlights" rows={4} value={formData.highlights} onChange={handleChange} placeholder="- Mejoré el rendimiento en un 20%&#10;- Lideré un equipo de 5 personas..." />
          <Input label="Tecnologías utilizadas (Separadas por comas)" name="technologies" value={formData.technologies} onChange={handleChange} placeholder="React, Node.js, TypeScript, Docker..." />
          <FormActions onCancel={closeForm} saving={saving} />
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Experiencia Laboral"
        subtitle="Gestiona tu historial de trabajos y proyectos empresariales."
        action={
          <Button size="sm" onClick={handleNew}>
            <Plus className="h-4 w-4 mr-2" /> Añadir Experiencia
          </Button>
        }
      />

      {error && <ErrorBanner message={error} onDismiss={clearError} />}

      {loading ? (
        <DashboardSkeleton showColdStartMessage={showColdStartMessage} variant="list" />
      ) : experiences.length === 0 ? (
        <EmptyState icon={Briefcase} title="No hay experiencias" description="Comienza agregando tu trabajo más reciente." />
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div key={exp._id} className="bg-surface border border-line p-5 rounded-xl shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-bold text-ink">{exp.jobTitle}</h4>
                  <div className="flex flex-wrap items-center text-sm text-muted mt-1 gap-4">
                    <span className="flex items-center"><Building className="h-4 w-4 mr-1 text-faint" /> {exp.company}</span>
                    <span className="flex items-center"><MapPin className="h-4 w-4 mr-1 text-faint" /> {exp.location}</span>
                    <span className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-faint" />
                      {new Date(exp.startDate).toLocaleDateString()} - {exp.isCurrent ? 'Actualidad' : (exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'N/A')}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <IconButton title="Editar" onClick={() => handleEdit(exp)} className="p-2 text-faint hover:text-accent hover:bg-accent-soft">
                    <Edit2 className="h-4 w-4" />
                  </IconButton>
                  <IconButton title="Eliminar" onClick={() => remove(exp._id)} className="p-2 text-faint hover:text-danger hover:bg-danger-soft">
                    <Trash2 className="h-4 w-4" />
                  </IconButton>
                </div>
              </div>
              <p className="text-ink-soft mt-4 text-sm">{exp.description}</p>

              {exp.technologies && exp.technologies.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {exp.technologies.map((tech, i) => (
                    <span key={i} className="px-2.5 py-1 bg-surface-soft text-ink-soft text-xs font-medium rounded-full border border-line">
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
