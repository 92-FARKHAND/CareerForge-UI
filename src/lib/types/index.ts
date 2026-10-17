export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta: unknown;
  error: unknown;
}

export interface User {
  id: string;
  email: string;
}

export interface AuthData {
  user: User;
}

export interface AuthCredentialsRequest {
  email: string;
  password: string;
}
