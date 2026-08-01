import { useCallback, useState } from 'react';

export function useForm<T>(initial: T) {
  const [formData, setFormData] = useState<T>(initial);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      setFormData((prev) => {
        if (type === 'checkbox') {
          return { ...prev, [name]: (e.target as HTMLInputElement).checked } as T;
        }
        return { ...prev, [name]: value } as T;
      });
    },
    []
  );

  const reset = useCallback(() => setFormData(initial), [initial]);

  return { formData, setFormData, handleChange, reset };
}
