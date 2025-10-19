export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'participant';
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'admin' | 'participant';

export interface CreateUserDTO {
  username: string;
  password: string;
  role?: UserRole;
}

export interface UserResponse {
  id: string;
  username: string;
  role: UserRole;
  createdAt: Date;
}
