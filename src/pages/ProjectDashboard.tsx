import { useAuthStore } from '../store/authStore';
import { Plus, Edit2, Trash2, Code, ExternalLink, Github, ImageIcon } from 'lucide-react';
import { useCrudResource } from '../hooks/useCrudResource';
import { useForm } from '../hooks/useForm';
import {
  Input, Textarea, Button, IconButton, Spinner, EmptyState,
  SectionHeader, FormActions, BackButton,
} from '../components/admin/ui';

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

interface ProjectForm {
  title: string;
  description: string;
  imageUrl: string;
  repoUrl: string;
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
  liveUrl: '',
  startDate: '',
  endDate: '',
  highlights: '',
  technologies: '',
};

const ProjectDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const { formData, setFormData, handleChange, reset } = useForm(initialForm);
  const { items: projects, loading, saving, isFormOpen, editingId, openForm, closeForm, save, remove } =
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
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-4xl">
        <BackButton onClick={closeForm} />
        <h3 className="text-xl font-bold text-gray-900 mb-6">{editingId ? 'Editar Proyecto' : 'Nuevo Proyecto'}</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Input label="Título del Proyecto" name="title" required value={formData.title} onChange={handleChange} />
            </div>
            <Input label="Repositorio (URL de GitHub)" type="url" name="repoUrl" value={formData.repoUrl} onChange={handleChange} placeholder="https://github.com/..." />
            <Input label="Sitio en Vivo (URL)" type="url" name="liveUrl" value={formData.liveUrl} onChange={handleChange} placeholder="https://..." />
            <Input label="URL de la Imagen / Captura" type="url" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://..." />
            <div className="flex gap-4">
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
    <div className="space-y-6 max-w-4xl">
      <SectionHeader
        title="Proyectos / Portafolio"
        subtitle="Gestiona los proyectos que se mostrarán en tu portafolio."
        action={
          <Button size="sm" onClick={handleNew}>
            <Plus className="h-4 w-4 mr-2" /> Añadir Proyecto
          </Button>
        }
      />

      {loading ? (
        <Spinner />
      ) : projects.length === 0 ? (
        <EmptyState icon={Code} title="No hay proyectos" description="Añade proyectos para construir tu portafolio." />
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
                    <IconButton title="Editar" onClick={() => handleEdit(proj)} className="p-1 text-gray-400 hover:text-blue-600">
                      <Edit2 className="h-4 w-4" />
                    </IconButton>
                    <IconButton title="Eliminar" onClick={() => remove(proj._id!)} className="p-1 text-gray-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </IconButton>
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
