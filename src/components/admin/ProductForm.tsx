import React from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import type { Product, ProductFormData, ApiErrorDetail } from '../../types/product';

interface ProductFormProps {
  onSubmit: SubmitHandler<ProductFormData>;
  onCancel: () => void;
  initialData?: Product | null;
  isLoading?: boolean;
  apiErrors?: ApiErrorDetail[] | null;
}

const ProductForm: React.FC<ProductFormProps> = ({ 
    onSubmit, 
    onCancel, 
    initialData = null, 
    isLoading = false,
    apiErrors = null 
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<ProductFormData>({
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      img: initialData?.img || '',
      price: initialData?.price ? parseFloat(initialData.price) : 0,
      stock: initialData?.stock ? parseInt(initialData.stock, 10) : 0,
    }
  });

  React.useEffect(() => {
    if (apiErrors) {
      apiErrors.forEach((err) => {
        if (err.path && typeof err.path === 'string' && err.path in errors) {
          setError(err.path as keyof ProductFormData, { type: 'server', message: err.msg });
        }
      });
    }
  }, [apiErrors, setError, errors]);

  const getFieldError = (fieldName: keyof ProductFormData): string | undefined => {
      return errors[fieldName]?.message;
  };

  const inputClass = (fieldName: keyof ProductFormData): string => {
      return `mt-1 block w-full px-3 py-2 border ${getFieldError(fieldName) ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white`;
  };

  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300";
  const errorClass = "mt-1 text-xs text-red-500";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className={labelClass}>Nombre</label>
        <input
          id="name"
          type="text"
          {...register('name', { required: 'El nombre es requerido' })}
          className={inputClass('name')}
          aria-invalid={!!getFieldError('name')}
        />
        {getFieldError('name') && <p className={errorClass} role="alert">{getFieldError('name')}</p>}
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>Descripción</label>
        <textarea
          id="description"
          {...register('description', { required: 'La descripción es requerida' })}
          className={inputClass('description')}
          rows={3}
          aria-invalid={!!getFieldError('description')}
        />
        {getFieldError('description') && <p className={errorClass} role="alert">{getFieldError('description')}</p>}
      </div>

      <div>
        <label htmlFor="price" className={labelClass}>Precio</label>
        <input
          id="price"
          type="number"
          step="0.01" // Permite decimales
          {...register('price', { 
              required: 'El precio es requerido', 
              valueAsNumber: true, // Importante para validación numérica
              min: { value: 0, message: 'El precio debe ser positivo' } 
          })}
          className={inputClass('price')}
           aria-invalid={!!getFieldError('price')}
        />
         {getFieldError('price') && <p className={errorClass} role="alert">{getFieldError('price')}</p>}
      </div>

      <div>
        <label htmlFor="stock" className={labelClass}>Stock</label>
        <input
          id="stock"
          type="number"
          step="1" // Solo enteros
           {...register('stock', { 
               required: 'El stock es requerido', 
               valueAsNumber: true,
               min: { value: 0, message: 'El stock no puede ser negativo' },
               validate: value => Number.isInteger(value) || 'El stock debe ser un número entero'
            })}
          className={inputClass('stock')}
           aria-invalid={!!getFieldError('stock')}
        />
         {getFieldError('stock') && <p className={errorClass} role="alert">{getFieldError('stock')}</p>}
      </div>

       <div>
        <label htmlFor="img" className={labelClass}>URL de Imagen (Opcional)</label>
        <input
          id="img"
          type="url"
          {...register('img')}
          className={inputClass('img')}
        />
      </div>

      {apiErrors && !apiErrors.some(err => err.path && err.path in errors) && (
          <p className="text-sm text-red-600 text-center" role="alert">
              {apiErrors[0]?.msg || 'Error en el servidor'}
          </p>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <button 
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          Cancelar
        </button>
        <button 
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? 'Guardando...' : (initialData ? 'Actualizar Producto' : 'Crear Producto')}
        </button>
      </div>
    </form>
  );
};

export default ProductForm; 