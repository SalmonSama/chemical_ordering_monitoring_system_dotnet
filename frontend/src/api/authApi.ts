import api from './client';
import type { LoginRequest, LoginResponse } from '../types/auth';

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>('/auth/login', data);
  return response.data;
}

export async function forgotPassword(email: string): Promise<{ message: string }> {
  const response = await api.post<{ message: string }>('/auth/forgot-password', { email });
  return response.data;
}
