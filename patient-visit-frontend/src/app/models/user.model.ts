export interface User {
  userId: number;
  username: string;
  email: string;
  role: string;
}

export interface RegisterUserDto {
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface LoginUserDto {
  username: string;
  password: string;
}

export interface ChangePasswordDto {
  userId: number;
  newPassword: string;
}

export interface AuthResponse {
  token: string;
}

