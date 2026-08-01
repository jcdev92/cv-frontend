import { useCallback, useEffect, useState } from 'react';
import api from '../api/axios';

interface CrudOptions<TForm> {
  transformPayload?: (formData: TForm) => Record<string, unknown>;
  deleteConfirmMessage?: string;
  saveErrorMessage?: string;
  deleteErrorMessage?: string;
}

export function useCrudResource<TItem extends { _id?: string }, TForm = unknown>(
  basePath: string,
  userId: string | undefined,
  options: CrudOptions<TForm> = {}
) {
  const {
    transformPayload,
    deleteConfirmMessage = '¿Estás seguro de que deseas eliminar este registro?',
    saveErrorMessage = 'Hubo un error al guardar.',
    deleteErrorMessage = 'Hubo un error al eliminar.',
  } = options;

  const [items, setItems] = useState<TItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;
    let ignore = false;
    api
      .get(`${basePath}?user=${userId}`)
      .then((res) => {
        if (!ignore) setItems(res.data);
      })
      .catch((error) => console.error(`Error cargando ${basePath}:`, error))
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [basePath, userId]);

  const refresh = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const res = await api.get(`${basePath}?user=${userId}`);
      setItems(res.data);
    } catch (error) {
      console.error(`Error cargando ${basePath}:`, error);
    } finally {
      setLoading(false);
    }
  }, [basePath, userId]);

  const openForm = useCallback((item?: TItem) => {
    setEditingId(item?._id ?? null);
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => setIsFormOpen(false), []);

  const save = useCallback(
    async (formData: TForm) => {
      setSaving(true);
      try {
        const payload = transformPayload ? transformPayload(formData) : formData;
        if (editingId) {
          await api.put(`${basePath}/${editingId}`, payload);
        } else {
          await api.post(basePath, payload);
        }
        await refresh();
        closeForm();
      } catch (error) {
        console.error(`Error guardando ${basePath}:`, error);
        alert(saveErrorMessage);
      } finally {
        setSaving(false);
      }
    },
    [basePath, editingId, transformPayload, refresh, closeForm, saveErrorMessage]
  );

  const remove = useCallback(
    async (id: string) => {
      if (!window.confirm(deleteConfirmMessage)) return;
      try {
        await api.delete(`${basePath}/${id}`);
        await refresh();
      } catch (error) {
        console.error(`Error eliminando ${basePath}:`, error);
        alert(deleteErrorMessage);
      }
    },
    [basePath, refresh, deleteConfirmMessage, deleteErrorMessage]
  );

  return { items, loading, saving, isFormOpen, editingId, openForm, closeForm, save, remove, refresh };
}
