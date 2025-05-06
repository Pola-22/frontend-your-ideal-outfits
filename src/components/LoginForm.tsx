import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import { loginUser } from '../services/auth';
import type { ApiError } from '../services/apiClient';

type LoginFormInputs = {
  email: string;
  password: string;
};

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
  });
  const [apiError, setApiError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<LoginFormInputs> = async (data) => {
    setApiError(null);
    try {
      await loginUser({ email: data.email, password: data.password });
      
      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get('redirectTo');
      window.location.href = redirectTo || '/admin';

    } catch (error: any) {
        console.error("Login failed:", error);
        const apiError = error as ApiError;
        setApiError(apiError.message || 'Error desconocido al iniciar sesión');
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md mt-5">
      <h1 className="text-2xl font-bold text-center text-gray-900">Iniciar Sesión (Admin)</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Correo Electrónico
          </label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: 'El correo electrónico es requerido',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Formato de correo inválido',
              },
            })}
            className={`mt-1 block w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            aria-invalid={errors.email ? "true" : "false"}
          />
          {errors.email && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Contraseña
          </label>
          <input
            id="password"
            type="password"
            {...register('password', { required: 'La contraseña es requerida' })}
            className={`mt-1 block w-full px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
            aria-invalid={errors.password ? "true" : "false"}
          />
          {errors.password && (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        {apiError && (
            <p className="text-sm text-red-600 text-center" role="alert">
                {apiError}
            </p>
        )}

        <div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Iniciando...' : 'Iniciar Sesión'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm; 