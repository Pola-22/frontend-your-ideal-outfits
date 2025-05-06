import React, { useState, useEffect, useCallback } from 'react';
import { getOrders, deleteOrder, updateOrder } from '../../services/orders';
import type { Order, UpdateOrderFormData, OrderDetailFormData } from '../../types/order';
import type { ApiError } from '../../services/apiClient';
import type { ApiErrorDetail } from '../../types/errors';
import OrderTable from './OrderTable';
import OrderDetailView from './OrderDetailView';
import OrderEditForm from './OrderEditForm';
import Modal from '../ui/Modal';

const OrderManager: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [apiErrors, setApiErrors] = useState<ApiErrorDetail[] | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadOrders = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err: any) {
        const apiError = err as ApiError;
        if (!apiError.isUnauthorized) { 
            setError(apiError.message || 'Error al cargar órdenes');
        }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleOpenDetailModal = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedOrder(null);
  };
  
  const handleOpenEditModal = (order: Order) => {
      setSelectedOrder(order);
      setApiErrors(null);
      setIsEditModalOpen(true);
  };
  
  const handleCloseEditModal = () => {
      setIsEditModalOpen(false);
      setSelectedOrder(null);
      setApiErrors(null);
  }

  const handleEditFormSubmit = async (data: UpdateOrderFormData) => {
      if (!selectedOrder) return;
      setIsSubmitting(true);
      setApiErrors(null);
      console.log('Actualizando orden:', selectedOrder.id, 'con datos:', data);
      try {
          const validatedData: UpdateOrderFormData = {
              ...data,
              orderDetail: data.orderDetail.map(d => ({ 
                  id_product: d.id_product, 
                  quantity: d.quantity 
                }))
          };
          
          await updateOrder(selectedOrder.id, validatedData);
          handleCloseEditModal();
          loadOrders();
      } catch (err: any) { 
         const apiError = err as ApiError;
         if (apiError.isUnauthorized) return;
         
         console.error("Error actualizando orden:", apiError);
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
             setApiErrors([{ type:'general', msg: apiError.message || 'Error al actualizar', path:'general', location:'', value:''}]);
         }
      } finally {
        setIsSubmitting(false);
     }
  };

  const handleDeleteOrder = async (orderId: number) => {
     if (window.confirm('¿Estás seguro de que quieres eliminar esta orden?')) {
            setDeletingId(orderId);
            setError(null);
            try {
                await deleteOrder(orderId);
                loadOrders();
            } catch (err: any) {
                 const apiError = err as ApiError;
                 if (!apiError.isUnauthorized) { 
                    setError(apiError.message || 'Error al eliminar la orden');
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
          <h2 className="text-2xl font-semibold leading-tight text-gray-800 dark:text-white">Órdenes</h2>
        </div>

        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}

        <OrderTable 
            orders={orders} 
            onViewDetails={handleOpenDetailModal}
            onEdit={handleOpenEditModal}
            onDelete={handleDeleteOrder}
            isLoading={isLoading}
            deletingId={deletingId}
         />
      </div>

      <OrderDetailView 
          order={selectedOrder} 
          isOpen={isDetailModalOpen} 
          onClose={handleCloseDetailModal} 
      />

      {selectedOrder && (
          <Modal 
            isOpen={isEditModalOpen} 
            onClose={handleCloseEditModal} 
            title={`Editar Orden #${selectedOrder?.id}`}
          >
             <OrderEditForm 
                 onSubmit={handleEditFormSubmit} 
                 onCancel={handleCloseEditModal}
                 initialData={selectedOrder}
                 isLoading={isSubmitting}
                 apiErrors={apiErrors}
             />
          </Modal>
      )}
    </div>
  );
};

export default OrderManager; 