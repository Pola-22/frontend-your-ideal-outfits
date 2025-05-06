import type { Product } from './product';

export interface OrderProductDetail {
    id: number;
    quantity: string;
    createdAt: string;
    updatedAt: string;
    id_order: number;
    id_product: number;
    product: Product;
}

export interface Order {
    id: number;
    client_name: string;
    document_number: string;
    number_phone: string;
    address: string;
    total: string; 
    createdAt: string;
    updatedAt: string;
    orderDetail: OrderProductDetail[];
}

export interface OrderDetailFormData {
    id_product: number;
    quantity: number;
}

export interface CreateOrderFormData {
    clientName: string;
    documentNumber: string;
    numberPhone: string;
    address: string;
    orderDetail: OrderDetailFormData[];
}

export interface UpdateOrderFormData extends CreateOrderFormData {}
export interface DeleteResponse {
    message: string;
}