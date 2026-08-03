import type { Education } from '../types/cv';
import { useAuthStore } from '../store/authStore';
import { Plus, Edit2, Trash2, Calendar, MapPin, GraduationCap, Building2 } from 'lucide-react';
import { useCrudResource } from '../hooks/useCrudResource';
import { useForm } from '../hooks/useForm';
import {
  Input, Textarea, Checkbox, Button, IconButton, Spinner, EmptyState,
  SectionHeader, FormActions, BackButton,
} from '../components/admin/ui';

interface EducationForm {
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

const initialForm: EducationForm = {
  degree: '',
  institution: '',
  location: '',
  startDate: '',
  endDate: '',
  isCurrent: false,
  description: '',
};

const EducationDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const { formData, setFormData, handleChange, reset } = useForm(initialForm);
  const { items, loading, saving, isFormOpen, editingId, openForm, closeForm, save, remove } =
    useCrudResource<Education, EducationForm>('/educations', user?._id, {
      transformPayload: (fd) => ({
        ...fd,
        endDate: fd.isCurrent ? null : fd.endDate,
      }),
      deleteConfirmMessage: '¿Estás seguro de que deseas eliminar este registro?',
    });

  const handleNew = () => {
    reset();
    openForm();
  };

  const handleEdit = (edu: Education) => {
    setFormData({
      degree: edu.degree,
      institution: edu.institution,
      location: edu.location || '',
      startDate: edu.startDate ? edu.startDate.substring(0, 10) : '',
      endDate: edu.endDate ? edu.endDate.substring(0, 10) : '',
      isCurrent: edu.isCurrent,
      description: edu.description || '',
    });
    openForm(edu);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    save(formData);
  };

  if (isFormOpen) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-4xl">
        <BackButton onClick={closeForm} />
        <h3 className="text-xl font-bold text-gray-900 mb-6">{editingId ? 'Editar Educación' : 'Nueva Educación'}</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Título / Grado" name="degree" required value={formData.degree} onChange={handleChange} placeholder="Ej: Ingeniería Informática" />
            <Input label="Institución" name="institution" required value={formData.institution} onChange={handleChange} />
            <Input label="Ubicación" name="location" value={formData.location} onChange={handleChange} placeholder="Ej: Madrid, España" />
            <Checkbox id="isCurrent" name="isCurrent" label="Estudio aquí actualmente" checked={formData.isCurrent} onChange={handleChange} />
            <Input label="Fecha de Inicio" type="date" name="startDate" required value={formData.startDate} onChange={handleChange} />
            {!formData.isCurrent && (
              <Input label="Fecha de Fin" type="date" name="endDate" required value={formData.endDate} onChange={handleChange} />
            )}
          </div>
          <Textarea label="Descripción (Opcional)" name="description" rows={3} value={formData.description} onChange={handleChange} placeholder="Menciones honoríficas, proyectos destacados..." />
          <FormActions onCancel={closeForm} saving={saving} />
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <SectionHeader
        title="Educación"
        subtitle="Gestiona tu historial académico y certificaciones."
        action={
          <Button size="sm" onClick={handleNew}>
            <Plus className="h-4 w-4 mr-2" /> Añadir Educación
          </Button>
        }
      />

      {loading ? (
        <Spinner />
      ) : items.length === 0 ? (
        <EmptyState icon={GraduationCap} title="No hay educación registrada" description="Añade tus títulos universitarios o cursos relevantes." />
      ) : (
        <div className="space-y-4">
          {items.map((edu) => (
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
                  <IconButton title="Editar" onClick={() => handleEdit(edu)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50">
                    <Edit2 className="h-4 w-4" />
                  </IconButton>
                  <IconButton title="Eliminar" onClick={() => remove(edu._id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </IconButton>
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
