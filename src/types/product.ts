export interface Product {
    id: number;
    name: string;
    description: string;
    img?: string | null;
    price: string;
    stock: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ProductFormData {
    name: string;
    description: string;
    img?: string | null;
    price: number;
    stock: number;
}

export interface ApiErrorDetail {
    type: string;
    value: string;
    msg: string;
    path: keyof ProductFormData | string;
    location: string;
}

export interface ApiValidationError {
    errors: ApiErrorDetail[];
}

export interface ApiSimpleError {
    message: string;
} 