import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import type { Order, UpdateOrderFormData } from '../../types/order';
import type { Product } from '../../types/product';
import type { ApiErrorDetail } from '../../types/errors';
import { getProducts } from '../../services/products'; // Para obtener lista de productos

interface OrderEditFormProps {
  onSubmit: SubmitHandler<UpdateOrderFormData>;
  onCancel: () => void;
  initialData: Order | null; // La orden a editar
  isLoading?: boolean;
  apiErrors?: ApiErrorDetail[] | null;
}

const OrderEditForm: React.FC<OrderEditFormProps> = ({ 
    onSubmit, 
    onCancel, 
    initialData, 
    isLoading = false,
    apiErrors = null 
}) => {
  
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [productLoadError, setProductLoadError] = useState<string | null>(null);

  // Cargar productos disponibles al montar
  useEffect(() => {
    const fetchProducts = async () => {
        try {
            const products = await getProducts();
            setAvailableProducts(products);
            setProductLoadError(null);
        } catch (error: any) {    
            console.error("Error cargando productos para el formulario:", error);
            setProductLoadError('No se pudieron cargar los productos disponibles.');
        }
    };
    fetchProducts();
  }, []);

  // Configuración del formulario
  const { 
      register, 
      control, 
      handleSubmit, 
      formState: { errors },
      setError,
      setValue, // Para actualizar campos si es necesario
      watch // Para observar cambios
    } = useForm<UpdateOrderFormData>({
    defaultValues: {
      clientName: initialData?.client_name || '',
      documentNumber: initialData?.document_number || '',
      numberPhone: initialData?.number_phone || '',
      address: initialData?.address || '',
      // Mapear orderDetail de la API (string quantity) a FormData (number quantity)
      orderDetail: initialData?.orderDetail ? initialData.orderDetail.map(d => ({
          id_product: d.id_product,
          quantity: parseInt(d.quantity, 10) || 1 // Asegurar que sea número
      })) : [],
    }
  });

  // Configuración para el array de detalles de orden
  const { fields, append, remove } = useFieldArray({
    control,
    name: "orderDetail"
  });

  // Mapear errores de API a campos
  useEffect(() => {
    if (apiErrors) {
      apiErrors.forEach((err) => {
        // TODO: Mejorar mapeo para errores dentro de orderDetail (ej: orderDetail[0].quantity)
        if (err.path && typeof err.path === 'string' && err.path in errors) {
          setError(err.path as keyof UpdateOrderFormData, { type: 'server', message: err.msg });
        } else {
            // Mostrar error general si no se pudo mapear
             console.warn('Error de API no mapeado a campo específico:', err);
        }
      });
    }
  }, [apiErrors, setError, errors]);

  // Clases de estilo reutilizables
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  const inputClass = (hasError: boolean): string => 
    `block w-full px-3 py-2 border ${hasError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white`;
  const errorClass = "mt-1 text-xs text-red-500";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
       {/* Campos del Cliente */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="clientName" className={labelClass}>Nombre Cliente</label>
                <input id="clientName" type="text" {...register('clientName', { required: 'Nombre requerido' })} className={inputClass(!!errors.clientName)} />
                {errors.clientName && <p className={errorClass}>{errors.clientName.message}</p>}
            </div>
             <div>
                <label htmlFor="documentNumber" className={labelClass}>Documento</label>
                <input id="documentNumber" type="text" {...register('documentNumber', { required: 'Documento requerido' })} className={inputClass(!!errors.documentNumber)} />
                {errors.documentNumber && <p className={errorClass}>{errors.documentNumber.message}</p>}
            </div>
             <div>
                <label htmlFor="numberPhone" className={labelClass}>Teléfono</label>
                <input id="numberPhone" type="tel" {...register('numberPhone', { required: 'Teléfono requerido' })} className={inputClass(!!errors.numberPhone)} />
                {errors.numberPhone && <p className={errorClass}>{errors.numberPhone.message}</p>}
            </div>
             <div>
                <label htmlFor="address" className={labelClass}>Dirección</label>
                <input id="address" type="text" {...register('address', { required: 'Dirección requerida' })} className={inputClass(!!errors.address)} />
                {errors.address && <p className={errorClass}>{errors.address.message}</p>}
            </div>
       </div>

        {/* Sección Detalles de Orden (Productos) */}
        <div className='border-t pt-4 mt-4'>
            <h4 className="text-md font-semibold mb-3 text-gray-800 dark:text-gray-200">Productos en la Orden</h4>
            {productLoadError && <p className={`${errorClass} mb-2`}>{productLoadError}</p>}
            
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2"> {/* Limitar altura y añadir scroll */} 
                {fields.map((item, index) => (
                    <div key={item.id} className="flex items-start space-x-3 p-2 border rounded dark:border-gray-600">
                        <div className="flex-1">
                            <label htmlFor={`orderDetail.${index}.id_product`} className="sr-only">Producto</label>
                            <select 
                                {...register(`orderDetail.${index}.id_product`, { required: true, valueAsNumber: true })} 
                                defaultValue={item.id_product} // RHF maneja esto con defaultValues, pero por si acaso
                                className={inputClass(!!errors.orderDetail?.[index]?.id_product) + ' text-sm'} 
                                disabled={availableProducts.length === 0}
                            >
                                <option value="" disabled>Selecciona un producto</option>
                                {availableProducts.map(p => (
                                    <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
                                ))}
                            </select>
                             {errors.orderDetail?.[index]?.id_product && <p className={errorClass}>Selecciona un producto</p>}
                        </div>
                        <div className="w-20">
                            <label htmlFor={`orderDetail.${index}.quantity`} className="sr-only">Cantidad</label>
                            <input 
                                type="number" 
                                {...register(`orderDetail.${index}.quantity`, { 
                                    required: 'Requerido', 
                                    valueAsNumber: true, 
                                    min: { value: 1, message: 'Min 1' }
                                 })} 
                                className={inputClass(!!errors.orderDetail?.[index]?.quantity) + ' text-sm'} 
                                defaultValue={item.quantity}
                            />
                             {errors.orderDetail?.[index]?.quantity && <p className={errorClass}>{errors.orderDetail?.[index]?.quantity?.message}</p>}
                        </div>
                        <button 
                            type="button" 
                            onClick={() => remove(index)} 
                            className="text-red-600 hover:text-red-800 p-2 mt-1 disabled:opacity-50" 
                            aria-label="Eliminar producto"
                            disabled={fields.length <= 1} // No permitir eliminar si es el único item
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>

            <button 
                type="button" 
                onClick={() => append({ id_product: availableProducts[0]?.id || 0, quantity: 1 })} 
                className="mt-3 text-sm text-indigo-600 hover:text-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={availableProducts.length === 0}
            >
                + Añadir Producto
            </button>
             {errors.orderDetail?.root && <p className={errorClass}>{errors.orderDetail.root.message}</p>} {/* Error a nivel de array */} 
             {errors.orderDetail && !errors.orderDetail.root && typeof errors.orderDetail !== 'string' && fields.length === 0 && (
                  <p className={errorClass}>Debes añadir al menos un producto.</p> // Validación si el array está vacío
             )}
        </div>

        {/* Mostrar error general de API */} 
        {apiErrors && apiErrors.some(e => e.path === 'general') && (
          <p className="text-sm text-red-600 text-center mt-4" role="alert">
              {apiErrors.find(e => e.path === 'general')?.msg || 'Error en el servidor'}
          </p>
        )}

        {/* Botones de Acción */}
        <div className="flex justify-end space-x-3 pt-5 border-t">
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
                disabled={isLoading || availableProducts.length === 0}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isLoading ? 'Actualizando...' : 'Actualizar Orden'}
            </button>
      </div>
    </form>
  );
};

export default OrderEditForm; 