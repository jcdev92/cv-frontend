import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';
import { Save, Loader2 } from 'lucide-react';
import type { Profile } from '../types/cv';
import { Input, Textarea, Button, ErrorBanner } from '../components/admin/ui';

interface ProfileForm {
  firstName: string;
  lastName: string;
  title: string;
  summary: string;
  email: string;
  phone: string;
  location: string;
  avatarUrl: string;
  resumeUrl: string;
  socialLinks: {
    linkedin: string;
    github: string;
    twitter: string;
    website: string;
  };
}

const defaultForm: ProfileForm = {
  firstName: '',
  lastName: '',
  title: '',
  summary: '',
  email: '',
  phone: '',
  location: '',
  avatarUrl: '',
  resumeUrl: '',
  socialLinks: {
    linkedin: '',
    github: '',
    twitter: '',
    website: ''
  }
};

const toForm = (profile: Profile | null | undefined): ProfileForm => ({
  ...defaultForm,
  ...profile,
  socialLinks: { ...defaultForm.socialLinks, ...(profile?.socialLinks || {}) },
});

const ProfileDashboard = () => {
  const user = useAuthStore((state) => state.user);

  const { data: profile, isLoading, isError, refetch } = useQuery({
    queryKey: ['profile', user?._id],
    queryFn: async (): Promise<Profile | null> => {
      const res = await api.get(`/profile?user=${user?._id}`);
      return res.data ?? null;
    },
    enabled: !!user?._id,
  });

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600 h-8 w-8" /></div>;
  }

  return (
    <ProfileForm key={profile?._id ?? 'new'} initial={toForm(profile)} isError={isError} onRetry={refetch} />
  );
};

interface ProfileFormProps {
  initial: ProfileForm;
  isError: boolean;
  onRetry: () => void;
}

const ProfileForm = ({ initial, isError, onRetry }: ProfileFormProps) => {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<ProfileForm>(initial);
  const [message, setMessage] = useState({ text: '', type: '' });

  const saveMutation = useMutation({
    mutationFn: (payload: ProfileForm) => api.put('/profile', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user?._id] });
      setMessage({ text: 'Perfil guardado con éxito!', type: 'success' });
    },
    onError: () => {
      setMessage({ text: 'Error al guardar el perfil.', type: 'error' });
    },
  });

  const saving = saveMutation.isPending;
  const error = saveMutation.isError || isError ? 'Hubo un error al cargar o guardar el perfil.' : null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name.startsWith('social.')) {
      const socialKey = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [socialKey]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    saveMutation.mutate(formData);
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-4xl dark:bg-gray-900 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Editar Perfil</h3>
          <p className="text-gray-500 text-sm dark:text-gray-400">Actualiza tu información personal y profesional básica.</p>
        </div>
        {message.text && (
          <span className={`px-4 py-2 rounded-md text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400' : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400'}`}>
            {message.text}
          </span>
        )}
      </div>

      {error && <ErrorBanner message={error} onDismiss={onRetry} />}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Datos Personales */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b pb-2 dark:text-gray-100 dark:border-gray-700">Datos Personales</h4>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Nombre" name="firstName" value={formData.firstName} onChange={handleChange} required />
              <Input label="Apellidos" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>

            <Input label="Título Profesional" name="title" value={formData.title} onChange={handleChange} required placeholder="Ej: Full Stack Developer" />

            <div className="grid grid-cols-2 gap-4">
              <Input label="Email Público" type="email" name="email" value={formData.email} onChange={handleChange} required />
              <Input label="Teléfono" type="text" name="phone" value={formData.phone} onChange={handleChange} />
            </div>

            <Input label="Ubicación" name="location" value={formData.location} onChange={handleChange} placeholder="Ej: Madrid, España" />
          </div>

          {/* Enlaces y URLs */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b pb-2 dark:text-gray-100 dark:border-gray-700">Enlaces y URLs</h4>

            <Input label="URL Foto de Perfil (Avatar)" type="url" name="avatarUrl" value={formData.avatarUrl} onChange={handleChange} />

            <Input label="URL de tu CV (PDF)" type="url" name="resumeUrl" value={formData.resumeUrl} onChange={handleChange} />

            <div className="grid grid-cols-2 gap-4">
              <Input label="LinkedIn URL" type="url" name="social.linkedin" value={formData.socialLinks.linkedin} onChange={handleChange} />
              <Input label="GitHub URL" type="url" name="social.github" value={formData.socialLinks.github} onChange={handleChange} />
              <Input label="Twitter/X URL" type="url" name="social.twitter" value={formData.socialLinks.twitter} onChange={handleChange} />
              <Input label="Sitio Web Personal" type="url" name="social.website" value={formData.socialLinks.website} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Resumen / Sobre mí */}
        <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
          <Textarea
            label="Sobre Mí (Resumen Profesional)"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            required
            rows={5}
            placeholder="Escribe un breve resumen de tu experiencia y objetivos..."
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" loading={saving}>
            {!saving && <Save className="mr-2 h-5 w-5" />}
            Guardar Cambios
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileDashboard;
