import { apiClient } from './apiClient';
import type { Product, ProductFormData } from '../types/product';

interface DeleteResponse {
    message: string;
}

export const getProducts = async (): Promise<Product[]> => {
    return apiClient<Product[]>('/products', {}, true);
};

export const getProduct = async (id: number): Promise<Product> => {
    return apiClient<Product>(`/products/${id}`, {}, true);
};

export const createProduct = async (productData: ProductFormData): Promise<Product> => {
    return apiClient<Product>('/products', {
        method: 'POST',
        body: JSON.stringify(productData),
    });
};

export const updateProduct = async (id: number, productData: ProductFormData): Promise<Product> => {
    return apiClient<Product>(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
    });
};

export const deleteProduct = async (id: number): Promise<DeleteResponse> => {
    return apiClient<DeleteResponse>(`/products/${id}`, {
        method: 'DELETE',
    });
}; 