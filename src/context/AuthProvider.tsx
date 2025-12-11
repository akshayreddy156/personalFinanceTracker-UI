import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import type { LoginRequest, RegisterRequest, User } from "../types/auth.types";
import { authservice } from "../services/auth.service";

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (Credentials: LoginRequest) => Promise<string>;
  logout: () => Promise<string>;
  register: (data: RegisterRequest) => Promise<string>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const checkAuth = useCallback(async () => {
    try {
      const currentUser = await authservice.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (Credentials: LoginRequest): Promise<string> => {
    setLoading(true);
    try {
      const response = await authservice.login(Credentials);
      setUser(response.data);
      return response.message || "Login successful";
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest): Promise<string> => {
    setLoading(true);
    try {
      const response = await authservice.register(data);
      setUser(response.data);
      return response.message || "Registration successful";
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<string> => {
    setLoading(true);
    try {
      await authservice.logout();
      setUser(null);
      return "Logged out successfully";
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  // Add beforeunload event listener to warn user about page refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      // Only show warning if user is logged in
      if (user) {
        e.preventDefault();
        // Modern browsers require returnValue to be set
        e.returnValue =
          "You will need to login again. Are you sure you want to refresh?";
        return "You will need to login again. Are you sure you want to refresh?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, register, checkAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined || context === null) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
