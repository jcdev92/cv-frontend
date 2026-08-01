import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuthStore } from '../store/authStore';
import { Save, Loader2 } from 'lucide-react';
import { Input, Textarea, Button } from '../components/admin/ui';

const ProfileDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  const [formData, setFormData] = useState({
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
  });

  useEffect(() => {
    if (user?._id) {
      api.get(`/profile?user=${user._id}`)
        .then((res) => {
          if (res.data) {
            // Mezclamos los datos por defecto con los que vengan de la API para evitar nulos
            setFormData(prev => ({
              ...prev,
              ...res.data,
              socialLinks: { ...prev.socialLinks, ...(res.data.socialLinks || {}) }
            }));
          }
        })
        .catch((err) => console.error("Error al cargar perfil:", err))
        .finally(() => setLoading(false));
    }
  }, [user]);

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

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });

    try {
      await api.put('/profile', formData);
      setMessage({ text: 'Perfil guardado con éxito!', type: 'success' });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setMessage({ text: `Error al guardar el perfil. ${errorMessage}`, type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-blue-600 h-8 w-8" /></div>;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Editar Perfil</h3>
          <p className="text-gray-500 text-sm">Actualiza tu información personal y profesional básica.</p>
        </div>
        {message.text && (
          <span className={`px-4 py-2 rounded-md text-sm font-medium ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
            {message.text}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Datos Personales */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b pb-2">Datos Personales</h4>
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
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider border-b pb-2">Enlaces y URLs</h4>

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
        <div className="pt-4 border-t border-gray-100">
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
