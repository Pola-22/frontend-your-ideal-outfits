import { apiClient } from './apiClient';
import type { Order, CreateOrderFormData, UpdateOrderFormData, DeleteResponse } from '../types/order';

console.log('Servicio de Órdenes - Aún no implementado');

export const getOrders = async (): Promise<Order[]> => {
    return apiClient<Order[]>('/orders');
};

export const getOrder = async (id: number): Promise<Order> => {
    return apiClient<Order>(`/orders/${id}`);
};

export const createOrder = async (orderData: CreateOrderFormData): Promise<Order> => {

    return apiClient<Order>('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
    }, true);
};

export const updateOrder = async (id: number, orderData: UpdateOrderFormData): Promise<Order> => {
    return apiClient<Order>(`/orders/${id}`, {
        method: 'PUT',
        body: JSON.stringify(orderData),
    });
};

export const deleteOrder = async (id: number): Promise<DeleteResponse> => {
    return apiClient<DeleteResponse>(`/orders/${id}`, {
        method: 'DELETE',
    });
};