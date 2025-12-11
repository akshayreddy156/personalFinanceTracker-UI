import type {
  LoginRequest,
  RegisterRequest,
  User,
  LoginResponse,
  RegisterResponse,
} from "../types/auth.types";
import api from "./api";

export const authservice = {
  login: async (Credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post("/auth/login", Credentials);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get("/auth/me");
    return response.data;
  },
};
