import React from 'react';
import type { Order } from '../../types/order';
import Modal from '../ui/Modal';

interface OrderDetailViewProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailView: React.FC<OrderDetailViewProps> = ({ order, isOpen, onClose }) => {
  if (!order) return null;

  const formatCurrency = (value: string | number) => {
    const numberValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(numberValue);
  };

   const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('es-CO', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit'
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Detalle Orden #${order.id}`}>
      <div className="space-y-4">
        <div>
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Cliente:</h4>
            <p className="text-gray-800 dark:text-gray-200">{order.client_name}</p>
        </div>
         <div>
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Documento:</h4>
            <p className="text-gray-800 dark:text-gray-200">{order.document_number}</p>
        </div>
        <div>
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Teléfono:</h4>
            <p className="text-gray-800 dark:text-gray-200">{order.number_phone}</p>
        </div>
        <div>
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Dirección:</h4>
            <p className="text-gray-800 dark:text-gray-200">{order.address}</p>
        </div>
         <div>
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Fecha Creación:</h4>
            <p className="text-gray-800 dark:text-gray-200">{formatDate(order.createdAt)}</p>
        </div>
        <div>
            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Última Actualización:</h4>
            <p className="text-gray-800 dark:text-gray-200">{formatDate(order.updatedAt)}</p>
        </div>

        <div className="pt-2">
            <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 border-t pt-2">Productos:</h4>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-800 dark:text-gray-200">
                {order.orderDetail.map((detail) => (
                    <li key={detail.id}>
                        ({detail.quantity}x) {detail.product.name} - {formatCurrency(detail.product.price)}
                    </li>
                ))}
            </ul>
        </div>

        <div className="text-right text-lg font-bold text-gray-900 dark:text-white border-t pt-2 mt-4">
            Total: {formatCurrency(order.total)}
        </div>

      </div>
    </Modal>
  );
};

export default OrderDetailView; 