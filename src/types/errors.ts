
export interface ApiErrorDetail {
    type: string;
    value: string;
    msg: string; 
    path: string; 
    location: string;
}

export interface ApiValidationError {
    errors: ApiErrorDetail[];
}

export interface ApiSimpleError {
    message: string;
} 