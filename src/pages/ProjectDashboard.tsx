import type { Project } from '../types/cv';
import { useAuthStore } from '../store/authStore';
import { Plus, Edit2, Trash2, Code, ExternalLink, Github, ImageIcon } from 'lucide-react';
import { useCrudResource } from '../hooks/useCrudResource';
import { useForm } from '../hooks/useForm';
import {
  Input, Textarea, Button, IconButton, EmptyState,
  SectionHeader, FormActions, BackButton, ErrorBanner, DashboardSkeleton,
} from '../components/admin/ui';
import { useColdStart } from '../hooks/useColdStart';

interface ProjectForm {
  title: string;
  description: string;
  imageUrl: string;
  repoUrl: string;
  frontendRepoUrl: string;
  backendRepoUrl: string;
  liveUrl: string;
  startDate: string;
  endDate: string;
  highlights: string;
  technologies: string;
}

const initialForm: ProjectForm = {
  title: '',
  description: '',
  imageUrl: '',
  repoUrl: '',
  frontendRepoUrl: '',
  backendRepoUrl: '',
  liveUrl: '',
  startDate: '',
  endDate: '',
  highlights: '',
  technologies: '',
};

const ProjectDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const { formData, setFormData, handleChange, reset } = useForm(initialForm);
  const { items: projects, loading, saving, isFormOpen, editingId, error, openForm, closeForm, save, remove, clearError } =
    useCrudResource<Project, ProjectForm>('/projects', user?._id, {
      transformPayload: (fd) => ({
        ...fd,
        highlights: fd.highlights.split('\n').filter((h) => h.trim() !== ''),
        technologies: fd.technologies.split(',').map((t) => t.trim()).filter((t) => t !== ''),
        startDate: fd.startDate || null,
        endDate: fd.endDate || null,
      }),
      deleteConfirmMessage: '¿Estás seguro de que deseas eliminar este proyecto?',
    });

  const showColdStartMessage = useColdStart(loading);

  const handleNew = () => {
    reset();
    openForm();
  };

  const handleEdit = (proj: Project) => {
    setFormData({
      title: proj.title,
      description: proj.description,
      imageUrl: proj.imageUrl || '',
      repoUrl: proj.repoUrl || '',
      frontendRepoUrl: proj.frontendRepoUrl || '',
      backendRepoUrl: proj.backendRepoUrl || '',
      liveUrl: proj.liveUrl || '',
      startDate: proj.startDate ? proj.startDate.substring(0, 10) : '',
      endDate: proj.endDate ? proj.endDate.substring(0, 10) : '',
      highlights: proj.highlights ? proj.highlights.join('\n') : '',
      technologies: proj.technologies ? proj.technologies.join(', ') : '',
    });
    openForm(proj);
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    save(formData);
  };

  if (isFormOpen) {
    return (
      <div className="bg-surface p-6 rounded-xl shadow-sm border border-line">
        <BackButton onClick={closeForm} />
        <h3 className="text-xl font-bold text-ink mb-6">{editingId ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h3>
        {error && <ErrorBanner message={error} onDismiss={clearError} />}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input label="Título del Proyecto" name="title" required value={formData.title} onChange={handleChange} />
            </div>
            <div className="md:col-span-2 lg:col-span-1">
              <Input label="Repositorio (URL de GitHub) - Proyecto Único" type="url" name="repoUrl" value={formData.repoUrl} onChange={handleChange} placeholder="https://github.com/..." />
            </div>
            <div className="md:col-span-2 lg:col-span-1">
              <Input label="Frontend (URL del Repo)" type="url" name="frontendRepoUrl" value={formData.frontendRepoUrl} onChange={handleChange} placeholder="https://github.com/" />
            </div>
            <div className="md:col-span-2 lg:col-span-1">
              <Input label="Backend (URL del Repo)" type="url" name="backendRepoUrl" value={formData.backendRepoUrl} onChange={handleChange} placeholder="https://github.com/..." />
            </div>
            <div className="md:col-span-2 lg:col-span-1">
              <Input label="URL de la Imagen / Captura" type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://..." />
            </div>
            <div className="md:col-span-2 lg:col-span-1">
              <Input label="Sitio en Vivo (URL)" type="url" name="liveUrl" value={formData.liveUrl} onChange={handleChange} placeholder="https://..." />
            </div>
            <div className="flex flex-col gap-y-4 md:flex-row md:gap-x-4 md:gap-y-0 md:col-span-2">
              <div className="flex-1">
                <Input label="Inicio (Opcional)" type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
              </div>
              <div className="flex-1">
                <Input label="Fin (Opcional)" type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
              </div>
            </div>
          </div>
          <Textarea label="Descripción" name="description" required rows={3} value={formData.description} onChange={handleChange} placeholder="¿De qué trata este proyecto?" />
          <Textarea label="Características / Logros (Uno por línea)" name="highlights" rows={3} value={formData.highlights} onChange={handleChange} placeholder="- Autenticación de usuarios&#10;- Integración con pasarela de pagos..." />
          <Input label="Tecnologías (Separadas por comas)" name="technologies" value={formData.technologies} onChange={handleChange} placeholder="React, Node.js, MongoDB..." />
          <FormActions onCancel={closeForm} saving={saving} />
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Proyectos / Portafolio"
        subtitle="Gestiona los proyectos que se mostrarán en tu portafolio."
        action={
          <Button size="sm" onClick={handleNew}>
            <Plus className="h-4 w-4 mr-2" /> Añadir Proyecto
          </Button>
        }
      />

      {error && <ErrorBanner message={error} onDismiss={clearError} />}

      {loading ? (
        <DashboardSkeleton showColdStartMessage={showColdStartMessage} variant="grid" />
      ) : projects.length === 0 ? (
        <EmptyState icon={Code} title="No hay proyectos" description="Añade proyectos para construir tu portafolio." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((proj) => (
            <div key={proj._id} className="bg-surface border border-line rounded-xl shadow-sm hover:shadow-md transition overflow-hidden flex flex-col">
              {proj.imageUrl ? (
                <div className="h-40 w-full overflow-hidden">
                  <img src={proj.imageUrl} alt={proj.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-40 w-full bg-surface-soft flex items-center justify-center text-faint">
                  <ImageIcon className="h-10 w-10 opacity-50" />
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="text-lg font-bold text-ink line-clamp-1">{proj.title}</h4>
                  <div className="flex space-x-1 ml-2">
                    <IconButton title="Editar" onClick={() => handleEdit(proj)} className="p-1 text-faint hover:text-accent">
                      <Edit2 className="h-4 w-4" />
                    </IconButton>
                    <IconButton title="Eliminar" onClick={() => remove(proj._id)} className="p-1 text-faint hover:text-danger">
                      <Trash2 className="h-4 w-4" />
                    </IconButton>
                  </div>
                </div>

                <p className="text-muted text-sm mb-4 line-clamp-3 flex-1">{proj.description}</p>

                {proj.technologies && proj.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {proj.technologies.slice(0, 4).map((tech, i) => (
                      <span key={i} className="px-2 py-0.5 bg-accent-soft text-accent text-xs font-medium rounded border border-accent-soft">
                        {tech}
                      </span>
                    ))}
                    {proj.technologies.length > 4 && <span className="text-xs text-muted">+{proj.technologies.length - 4}</span>}
                  </div>
                )}

                <div className="pt-4 border-t border-line flex space-x-4">
                  {proj.repoUrl && (
                    <a href={proj.repoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-muted hover:text-ink">
                      <Github className="h-4 w-4 mr-1.5" /> Código
                    </a>
                  )}
                  {proj.frontendRepoUrl && (
                    <a href={proj.frontendRepoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-muted hover:text-ink">
                      <Github className="h-4 w-4 mr-1.5" /> Frontend
                    </a>
                  )}
                  {proj.backendRepoUrl && (
                    <a href={proj.backendRepoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-muted hover:text-ink">
                      <Github className="h-4 w-4 mr-1.5" /> Backend
                    </a>
                  )}
                  {proj.liveUrl && (
                    <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-accent hover:text-accent">
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
