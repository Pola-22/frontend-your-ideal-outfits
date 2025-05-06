import React from 'react';
import type { Order } from '../../types/order';

interface OrderTableProps {
  orders: Order[];
  onViewDetails: (order: Order) => void;
  onEdit: (order: Order) => void;
  onDelete: (orderId: number) => void;
  isLoading?: boolean;
  deletingId?: number | null;
}

const OrderTable: React.FC<OrderTableProps> = ({ 
    orders, 
    onViewDetails,
    onEdit,
    onDelete,
    isLoading = false,
    deletingId = null 
}) => {

  const formatCurrency = (value: string | number) => {
    const numberValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(numberValue);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric', month: 'short', day: 'numeric' 
    });
  };

  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="py-3 px-6">ID</th>
            <th scope="col" className="py-3 px-6">Fecha</th>
            <th scope="col" className="py-3 px-6">Cliente</th>
            <th scope="col" className="py-3 px-6">Documento</th>
            <th scope="col" className="py-3 px-6">Teléfono</th>
            {/* <th scope="col" className="py-3 px-6">Dirección</th> // Podría ser muy largo */}
            <th scope="col" className="py-3 px-6">Total</th>
            <th scope="col" className="py-3 px-6">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 && !isLoading && (
             <tr>
                 <td colSpan={7} className="py-4 px-6 text-center text-gray-500 dark:text-gray-400">
                     No se encontraron órdenes.
                 </td>
             </tr> 
          )}
           {isLoading && (
              <tr>
                 <td colSpan={7} className="py-4 px-6 text-center text-gray-500 dark:text-gray-400">
                     Cargando órdenes...
                 </td>
             </tr> 
          )}
          {!isLoading && orders.map((order) => (
            <tr key={order.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <td className="py-4 px-6">{order.id}</td>
              <td className="py-4 px-6">{formatDate(order.createdAt)}</td>
              <th scope="row" className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                {order.client_name}
              </th>
              <td className="py-4 px-6">{order.document_number}</td>
              <td className="py-4 px-6">{order.number_phone}</td>
              {/* <td className="py-4 px-6 max-w-xs truncate">{order.address}</td> */}
              <td className="py-4 px-6">{formatCurrency(order.total)}</td>
              <td className="py-4 px-6 flex space-x-2">
                 <button 
                  onClick={() => onViewDetails(order)}
                  disabled={isLoading || !!deletingId}
                  className="font-medium text-blue-600 dark:text-blue-500 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Ver
                </button>
                <button 
                  onClick={() => onEdit(order)}
                  disabled={isLoading || !!deletingId}
                  className="font-medium text-indigo-600 dark:text-indigo-500 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Editar
                </button>
                <button 
                  onClick={() => onDelete(order.id)}
                  disabled={isLoading || !!deletingId}
                  className={`font-medium text-red-600 dark:text-red-500 hover:underline disabled:opacity-50 disabled:cursor-not-allowed ${deletingId === order.id ? 'animate-pulse' : ''}`}
                 >
                   {deletingId === order.id ? 'Eliminando...' : 'Eliminar'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderTable; 