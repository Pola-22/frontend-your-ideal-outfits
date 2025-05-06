import React from 'react';
import type { Product } from '../../types/product';

interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
  isLoading?: boolean; // Para mostrar feedback en los botones
  deletingId?: number | null; // Para mostrar feedback en un botón específico
}

const ProductTable: React.FC<ProductTableProps> = ({ 
    products, 
    onEdit, 
    onDelete,
    isLoading = false, // Loading general (ej: cargando lista)
    deletingId = null
}) => {

  const formatCurrency = (value: string | number) => {
    const numberValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(numberValue);
  };

  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="py-3 px-6">ID</th>
            <th scope="col" className="py-3 px-6">Nombre</th>
            <th scope="col" className="py-3 px-6">Descripción</th>
            <th scope="col" className="py-3 px-6">Precio</th>
            <th scope="col" className="py-3 px-6">Stock</th>
            <th scope="col" className="py-3 px-6">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 && !isLoading && (
             <tr>
                 <td colSpan={6} className="py-4 px-6 text-center text-gray-500 dark:text-gray-400">
                     No se encontraron productos.
                 </td>
             </tr> 
          )}
          {isLoading && (
              <tr>
                 <td colSpan={6} className="py-4 px-6 text-center text-gray-500 dark:text-gray-400">
                     Cargando productos...
                 </td>
             </tr> 
          )}
          {!isLoading && products.map((product) => (
            <tr key={product.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className="py-4 px-6">{product.id}</td>
              <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {product.name}
              </th>
              <td className="py-4 px-6 max-w-xs truncate">{product.description}</td>
              <td className="py-4 px-6">{formatCurrency(product.price)}</td>
              <td className="py-4 px-6">{product.stock}</td>
              <td className="py-4 px-6 flex space-x-2">
                <button 
                  onClick={() => onEdit(product)}
                  disabled={isLoading || !!deletingId}
                  className="font-medium text-indigo-600 dark:text-indigo-500 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Editar
                </button>
                <button 
                  onClick={() => onDelete(product.id)}
                  disabled={isLoading || !!deletingId}
                  className={`font-medium text-red-600 dark:text-red-500 hover:underline disabled:opacity-50 disabled:cursor-not-allowed ${deletingId === product.id ? 'animate-pulse' : ''}`}
                 >
                  {deletingId === product.id ? 'Eliminando...' : 'Eliminar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable; 