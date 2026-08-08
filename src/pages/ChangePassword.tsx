import { useState } from 'react';
import { isAxiosError } from 'axios';
import api from '../api/axios';
import { SectionHeader, Input, Button, ErrorBanner } from '../components/admin/ui';
import { KeyRound } from 'lucide-react';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword.length < 8) {
      setError('La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas nuevas no coinciden');
      return;
    }

    setSaving(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      setSuccess('Contraseña actualizada correctamente');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      if (isAxiosError<{ message?: string }>(err)) {
        setError(err.response?.data?.message || 'Error al cambiar la contraseña');
      } else {
        setError('Error al cambiar la contraseña');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Cambiar Contraseña"
        subtitle="Actualiza la contraseña de acceso a tu panel de administración."
      />

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-lg dark:bg-gray-900 dark:border-gray-700">
        {error && <div className="mb-4"><ErrorBanner message={error} onDismiss={() => setError('')} /></div>}
        {success && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-green-50 text-green-700 text-sm font-medium border border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Input
              label="Contraseña actual"
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
            />
            <Input
              label="Nueva contraseña"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Mínimo 8 caracteres"
            />
            <Input
              label="Confirmar nueva contraseña"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Repite la nueva contraseña"
            />
          </div>

          <Button type="submit" size="md" loading={saving} className="w-full">
            <KeyRound className="h-4 w-4 mr-2" />
            Actualizar contraseña
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;