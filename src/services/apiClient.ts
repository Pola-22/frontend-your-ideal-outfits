import type { ApiValidationError, ApiSimpleError } from '../types/errors';

const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL;

export interface ApiError extends Error {
  status?: number;
  validationErrors?: any;
  isUnauthorized?: boolean;
}

/**
 * @param endpoint 
 * @param options 
 * @param isPublic 
 * @returns 
 */
export const apiClient = async <T>(endpoint: string, options: RequestInit = {}, isPublic: boolean = false): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const fetchOptions: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    credentials: !isPublic ? 'include' : options.credentials,
  };
  console.log(fetchOptions)

  try {
    const response = await fetch(url, fetchOptions);

    if (!isPublic && (response.status === 401 || response.status === 403)) {
      console.error('API Error: Unauthorized/Forbidden', response.url);
      
      if (!window.location.pathname.startsWith('/login')) {
          const redirectTo = encodeURIComponent(window.location.pathname + window.location.search);
          window.location.href = `/login?error=session_expired&redirectTo=${redirectTo}`;
      }
      const error: ApiError = new Error('Unauthorized');
      error.status = response.status;
      error.isUnauthorized = true;
      throw error;
    }

    if (!response.ok) {
        let errorData: ApiValidationError | ApiSimpleError | any = {}; 
        try {
            errorData = await response.json();
        } catch (e) {
            errorData.message = response.statusText;
        }
        
        const errorMessage = errorData.message || (errorData.errors && errorData.errors[0]?.msg) || `Error ${response.status}`;
        const error: ApiError = new Error(errorMessage);
        error.status = response.status;
        if (errorData.errors) {
            error.validationErrors = errorData.errors; 
        }
        console.error('API Error:', error);
        throw error;
    }

    if (response.status === 204) {
        return undefined as T;
    }
    
    return await response.json() as T;

  } catch (error: any) {
      if (error.status || error.isUnauthorized) {
          throw error; 
      }
      console.error('Network/Fetch Error:', error);
      const networkError: ApiError = new Error('Error de red o al contactar el servidor.');
      throw networkError;
  }
}; 