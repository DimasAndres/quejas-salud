import { useState, useEffect } from "react";
import { authAPI } from "@/lib/api";

interface User {
  id: number;
  nombre: string;
  apellido: string;
  cedula: string;
  celular: string;
  correo: string;
  tipoUsuario: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (cedula: string, password: string) => {
    const response = await authAPI.login({ cedula, password });
    setUser(response.user);
    return response;
  };

  const register = async (data: any) => {
    const response = await authAPI.register(data);
    setUser(response.user);
    return response;
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };
}
