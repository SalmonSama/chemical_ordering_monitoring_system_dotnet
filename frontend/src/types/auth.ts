// Auth types aligned with plan doc 04 and 26

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  roleId: string;
  roleName: string;
  roleDisplayName: string;
  locationScopeType: string; // "all" | "specific"
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  locations: LocationInfo[];
}

export interface LocationInfo {
  id: string;
  name: string;
  code: string;
}

export interface UserResponse {
  id: string;
  email: string;
  fullName: string;
  roleId: string;
  roleName: string;
  roleDisplayName: string;
  locationScopeType: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  locations: LocationInfo[];
}

export interface CreateUserRequest {
  email: string;
  fullName: string;
  password: string;
  roleId: string;
  locationScopeType: string;
  locationIds: string[];
  isActive: boolean;
}

export interface UpdateUserRequest {
  fullName: string;
  roleId: string;
  locationScopeType: string;
  locationIds: string[];
  isActive: boolean;
}

export interface ResetPasswordRequest {
  newPassword: string;
}

export interface RoleOption {
  id: string;
  name: string;
  displayName: string;
}

export interface LocationOption {
  id: string;
  name: string;
  code: string;
}
