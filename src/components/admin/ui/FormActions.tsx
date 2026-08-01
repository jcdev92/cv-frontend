import { Button } from './Button';

interface FormActionsProps {
  onCancel: () => void;
  saving?: boolean;
  cancelLabel?: string;
  submitLabel?: string;
}

export const FormActions = ({ onCancel, saving = false, cancelLabel = 'Cancelar', submitLabel = 'Guardar' }: FormActionsProps) => (
  <div className="flex justify-end pt-4">
    <button type="button" onClick={onCancel} className="mr-3 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition">
      {cancelLabel}
    </button>
    <Button type="submit" loading={saving}>{submitLabel}</Button>
  </div>
);
