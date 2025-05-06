import React, { useState, useEffect, useCallback } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/products';
import type { Product, ProductFormData, ApiErrorDetail } from '../../types/product';
import type { ApiError } from '../../services/apiClient';
import ProductTable from './ProductTable';
import ProductForm from './ProductForm';
import Modal from '../ui/Modal';

const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [apiErrors, setApiErrors] = useState<ApiErrorDetail[] | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err: any) {
        const apiError = err as ApiError;
        if (!apiError.isUnauthorized) { 
            setError(apiError.message || 'Error al cargar productos');
        }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleOpenModal = (product: Product | null = null) => {
    setEditingProduct(product);
    setApiErrors(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setApiErrors(null);
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);
    setApiErrors(null);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
      } else {
        await createProduct(data);
      }
      handleCloseModal();
      loadProducts();
    } catch (err: any) {
       const apiError = err as ApiError;
       if (apiError.isUnauthorized) return;
       
       if (apiError.validationErrors) {
           const formErrors = (apiError.validationErrors as any[]).map(e => ({
               type: 'server',
               msg: e.msg,
               path: e.path,
               value: e.value,
               location: e.location
           } as ApiErrorDetail));
           setApiErrors(formErrors);
       } else {
           setApiErrors([{ type:'general', msg: apiError.message || 'Error al guardar', path:'general', location:'', value:''}]);
       }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
     if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
            setDeletingId(productId);
            setError(null);
            try {
                await deleteProduct(productId);
                loadProducts();
            } catch (err: any) {
                 const apiError = err as ApiError;
                 if (!apiError.isUnauthorized) { 
                    setError(apiError.message || 'Error al eliminar el producto');
                 }
            } finally {
                 setDeletingId(null);
            }
        }
  };

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold leading-tight text-gray-800 dark:text-white">Productos</h2>
          <button 
            onClick={() => handleOpenModal()} 
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded shadow"
          >
            Añadir Producto
          </button>
        </div>

        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}

        <ProductTable 
            products={products} 
            onEdit={handleOpenModal} 
            onDelete={handleDeleteProduct}
            isLoading={isLoading}
            deletingId={deletingId}
         />
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={editingProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
      >
        <ProductForm 
          onSubmit={handleFormSubmit} 
          onCancel={handleCloseModal}
          initialData={editingProduct}
          isLoading={isSubmitting}
          apiErrors={apiErrors}
        />
      </Modal>
    </div>
  );
};

export default ProductManager; 