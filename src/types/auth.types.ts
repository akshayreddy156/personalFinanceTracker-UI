import type { ApiResponse } from "./api.types";

export interface User {
  userId: number;
  name: string;
  email: string;
  monthlyIncome: number;
  availableBalance: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  monthlyIncome: number;
}

export type RegisterResponse = ApiResponse<User>;
export type LoginResponse = ApiResponse<User>;
