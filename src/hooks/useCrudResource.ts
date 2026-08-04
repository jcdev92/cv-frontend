import { useCallback, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { resourceApi } from '../api/resources';

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

  const queryClient = useQueryClient();
  const queryKey = useMemo(() => [basePath, userId], [basePath, userId]);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: items = [], isLoading: loading, isError, refetch } = useQuery({
    queryKey,
    queryFn: () => resourceApi.list<TItem>(basePath, userId),
    enabled: !!userId,
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey });
  }, [queryClient, queryKey]);

  const saveMutation = useMutation({
    mutationFn: async (formData: TForm) => {
      const payload = transformPayload ? transformPayload(formData) : (formData as Record<string, unknown>);
      if (editingId) {
        await resourceApi.update(basePath, editingId, payload);
      } else {
        await resourceApi.create(basePath, payload);
      }
    },
    onSuccess: () => {
      invalidate();
      setError(null);
      setIsFormOpen(false);
    },
    onError: () => setError(saveErrorMessage),
  });

  const removeMutation = useMutation({
    mutationFn: (id: string) => resourceApi.remove(basePath, id),
    onSuccess: () => invalidate(),
    onError: () => setError(deleteErrorMessage),
  });

  const openForm = useCallback((item?: TItem) => {
    setEditingId(item?._id ?? null);
    setError(null);
    setIsFormOpen(true);
  }, []);

  const closeForm = useCallback(() => setIsFormOpen(false), []);

  const save = useCallback((formData: TForm) => saveMutation.mutate(formData), [saveMutation]);

  const remove = useCallback(
    (id: string) => {
      if (!window.confirm(deleteConfirmMessage)) return;
      removeMutation.mutate(id);
    },
    [removeMutation, deleteConfirmMessage]
  );

  const clearError = useCallback(() => setError(null), []);

  return {
    items,
    loading,
    saving: saveMutation.isPending,
    isFormOpen,
    editingId,
    error,
    isError,
    openForm,
    closeForm,
    save,
    remove,
    refresh: refetch,
    clearError,
  };
}
