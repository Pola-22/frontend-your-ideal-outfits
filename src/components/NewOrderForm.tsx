import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import type { CreateOrderFormData } from '../types/order';
import type { Product } from '../types/product';
import type { ApiErrorDetail } from '../types/errors';
import type { ApiError } from '../services/apiClient';
import { getProducts } from '../services/products';
import { createOrder } from '../services/orders';

const NewOrderForm: React.FC = () => {
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [productLoadError, setProductLoadError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [apiErrors, setApiErrors] = useState<ApiErrorDetail[] | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
        try {
            const products = await getProducts();
            setAvailableProducts(products);
            setProductLoadError(null);
        } catch (error: any) {
            console.error("Error cargando productos:", error);
            setProductLoadError('Error al cargar productos. No se pueden añadir artículos.');
        }
    };
    fetchProducts();
  }, []);

  const { 
      register, 
      control, 
      handleSubmit, 
      formState: { errors },
      reset,
      setError 
    } = useForm<CreateOrderFormData>({
    defaultValues: {
      clientName: '',
      documentNumber: '',
      numberPhone: '',
      address: '',
      orderDetail: [], 
    }
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "orderDetail"
  });

  useEffect(() => {
    if (availableProducts.length > 0 && fields.length === 0) {
        append({ id_product: availableProducts[0].id, quantity: 1 });
    }
  }, [availableProducts, append, fields.length]);
  useEffect(() => {
    if (apiErrors) {
      apiErrors.forEach((err) => {
        if (err.path && typeof err.path === 'string') {
            const match = err.path.match(/orderDetail\[(\d+)\]\.(\w+)/);
            if (match) {
                const index = parseInt(match[1], 10);
                const fieldName = match[2] as keyof CreateOrderFormData['orderDetail'][number];
                 setError(`orderDetail.${index}.${fieldName}`, { type: 'server', message: err.msg });
            } else if (err.path in errors) {
                 setError(err.path as keyof CreateOrderFormData, { type: 'server', message: err.msg });
            } else {
                 console.warn('Error de API no mapeado:', err);
            }
        }
      });
    } 
  }, [apiErrors, setError, errors]);

  const onSubmit: SubmitHandler<CreateOrderFormData> = async (data) => {
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setSubmitError(null);
    setApiErrors(null);

    if (data.orderDetail.length === 0) {
        setSubmitError("Debes añadir al menos un producto a la orden.");
        setIsSubmitting(false);
        return;
    }

    try {
      const createdOrder = await createOrder(data);
      console.log('Orden creada:', createdOrder);
      setSubmitSuccess(true);
      reset();
      if (availableProducts.length > 0) {
          replace([{ id_product: availableProducts[0].id, quantity: 1 }]);
      } else {
          replace([]);
      }
    } catch (error: any) {
      const apiError = error as ApiError;
      console.error("Error creando orden:", apiError);
       if (apiError.validationErrors) {
            const formErrors = (apiError.validationErrors as any[]).map(e => ({
                 type: 'server', msg: e.msg, path: e.path, value: e.value, location: e.location
             } as ApiErrorDetail));
             setApiErrors(formErrors);
             setSubmitError("Por favor corrige los errores en el formulario.");
       } else {
           setSubmitError(apiError.message || 'Ocurrió un error inesperado al crear la orden.');
       }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clases de estilo
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1";
  const inputClass = (hasError: boolean): string => 
    `block w-full px-3 py-2 border ${hasError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white`;
  const errorClass = "mt-1 text-xs text-red-500";

  return (
    <div className="w-full max-w-3xl mx-auto p-6 md:p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md mt-5">
        <a href="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Regresar
        </a>

        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6">Crear Nueva Orden</h1>

        {submitSuccess && (
            <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                ¡Orden creada exitosamente! Gracias por tu pedido.
            </div>
        )}
         {submitError && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {submitError}
            </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <fieldset className="border p-4 rounded dark:border-gray-600">
                <legend className="text-lg font-medium px-2 text-gray-800 dark:text-gray-200">Tus Datos</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                     <div>
                        <label htmlFor="clientName" className={labelClass}>Nombre Completo</label>
                        <input id="clientName" type="text" {...register('clientName', { required: 'Nombre requerido' })} className={inputClass(!!errors.clientName)} />
                        {errors.clientName && <p className={errorClass}>{errors.clientName.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="documentNumber" className={labelClass}>Documento Identidad</label>
                        <input id="documentNumber" type="text" {...register('documentNumber', { required: 'Documento requerido' })} className={inputClass(!!errors.documentNumber)} />
                        {errors.documentNumber && <p className={errorClass}>{errors.documentNumber.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="numberPhone" className={labelClass}>Teléfono de Contacto</label>
                        <input id="numberPhone" type="tel" {...register('numberPhone', { required: 'Teléfono requerido' })} className={inputClass(!!errors.numberPhone)} />
                        {errors.numberPhone && <p className={errorClass}>{errors.numberPhone.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="address" className={labelClass}>Dirección de Envío</label>
                        <input id="address" type="text" {...register('address', { required: 'Dirección requerida' })} className={inputClass(!!errors.address)} />
                        {errors.address && <p className={errorClass}>{errors.address.message}</p>}
                    </div>
                </div>
            </fieldset>

             <fieldset className="border p-4 rounded dark:border-gray-600">
                <legend className="text-lg font-medium px-2 text-gray-800 dark:text-gray-200">Tu Pedido</legend>
                {productLoadError && <p className={`text-center ${errorClass} mb-2`}>{productLoadError}</p>}
                
                <div className="space-y-3 mt-2 max-h-72 overflow-y-auto pr-2"> 
                    {fields.map((item, index) => (
                        <div key={item.id} className="flex items-start space-x-3 p-2 border rounded dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
                            <div className="flex-1">
                                <label htmlFor={`orderDetail.${index}.id_product`} className="sr-only">Producto</label>
                                <select 
                                    {...register(`orderDetail.${index}.id_product`, { required: 'Selecciona producto', valueAsNumber: true })} 
                                    className={inputClass(!!errors.orderDetail?.[index]?.id_product) + ' text-sm'} 
                                    disabled={availableProducts.length === 0}
                                >
                                    <option value="" disabled>Selecciona un producto...</option>
                                    {availableProducts.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} (${p.price})</option>
                                    ))}
                                </select>
                                {errors.orderDetail?.[index]?.id_product && <p className={errorClass}>{errors.orderDetail?.[index]?.id_product?.message}</p>}
                            </div>
                            <div className="w-24">
                                <label htmlFor={`orderDetail.${index}.quantity`} className="sr-only">Cantidad</label>
                                <input 
                                    type="number" 
                                    {...register(`orderDetail.${index}.quantity`, { 
                                        required: 'Cantidad', 
                                        valueAsNumber: true, 
                                        min: { value: 1, message: 'Min 1' }
                                    })} 
                                    className={inputClass(!!errors.orderDetail?.[index]?.quantity) + ' text-sm'} 
                                    min="1"
                                />
                                {errors.orderDetail?.[index]?.quantity && <p className={errorClass}>{errors.orderDetail?.[index]?.quantity?.message}</p>}
                            </div>
                            <button 
                                type="button" 
                                onClick={() => remove(index)} 
                                className="text-red-600 hover:text-red-800 p-2 mt-1 disabled:opacity-50 disabled:cursor-not-allowed" 
                                aria-label="Eliminar producto"
                                disabled={fields.length <= 1}
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
                    disabled={availableProducts.length === 0 || !!productLoadError}
                >
                    + Añadir otro Producto
                </button>
                 {errors.orderDetail?.root && <p className={errorClass}>{errors.orderDetail.root.message}</p>} 
                {fields.length === 0 && !productLoadError && (
                    <p className={errorClass}>Debes añadir al menos un producto a tu orden.</p>
                )}

             </fieldset>

            <div className="text-center pt-4">
                 <button 
                    type="submit"
                    disabled={isSubmitting || availableProducts.length === 0 || fields.length === 0 || !!productLoadError}
                    className="w-full md:w-auto px-8 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Enviando Orden...' : 'Realizar Pedido'}
                </button>
            </div>
        </form>
    </div>
  );
};

export default NewOrderForm; 