import { z } from 'zod';

export const loginSchema = z.object({
  identifier: z.string().min(1, 'El email o usuario es requerido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export interface LoginParams {
  email?: string;
  username?: string;
  password: string;
}

export interface AcessResponse {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  token: AcessResponse;
  status: number;
}

export interface BadLoginResponse {
  status: number;
}
