import api from './client';
import type {
  UserResponse,
  CreateUserRequest,
  UpdateUserRequest,
  ResetPasswordRequest,
  RoleOption,
  LocationOption,
} from '../types/auth';

export async function getUsers(): Promise<UserResponse[]> {
  const response = await api.get<UserResponse[]>('/users');
  return response.data;
}

export async function getUser(id: string): Promise<UserResponse> {
  const response = await api.get<UserResponse>(`/users/${id}`);
  return response.data;
}

export async function createUser(data: CreateUserRequest): Promise<UserResponse> {
  const response = await api.post<UserResponse>('/users', data);
  return response.data;
}

export async function updateUser(id: string, data: UpdateUserRequest): Promise<UserResponse> {
  const response = await api.put<UserResponse>(`/users/${id}`, data);
  return response.data;
}

export async function resetPassword(id: string, data: ResetPasswordRequest): Promise<{ message: string }> {
  const response = await api.put<{ message: string }>(`/users/${id}/reset-password`, data);
  return response.data;
}

export async function getRoles(): Promise<RoleOption[]> {
  const response = await api.get<RoleOption[]>('/roles');
  return response.data;
}

export async function getLocations(): Promise<LocationOption[]> {
  const response = await api.get<LocationOption[]>('/locations');
  return response.data;
}
