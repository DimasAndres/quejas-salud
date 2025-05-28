import { apiRequest } from "./queryClient";

export interface AuthResponse {
  user: {
    id: number;
    nombre: string;
    apellido: string;
    cedula: string;
    celular: string;
    correo: string;
    tipoUsuario: string;
  };
}

export interface RegisterData {
  nombre: string;
  apellido: string;
  cedula: string;
  celular: string;
  correo: string;
  tipoUsuario: string;
  password: string;
}

export interface LoginData {
  cedula: string;
  password: string;
}

export interface QuejaData {
  problema: string;
  detalle: string;
  ciudad: string;
  departamento: string;
  clasificacion: string;
  paraBeneficiario: boolean;
}

export const authAPI = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiRequest("POST", "/api/register", data);
    return response.json();
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiRequest("POST", "/api/login", data);
    return response.json();
  },

  logout: async (): Promise<void> => {
    await apiRequest("POST", "/api/logout");
  },

  getCurrentUser: async (): Promise<AuthResponse> => {
    const response = await apiRequest("GET", "/api/user");
    return response.json();
  },
};

export const quejasAPI = {
  create: async (data: QuejaData, files?: FileList): Promise<any> => {
    const formData = new FormData();
    
    // Add form fields
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });

    // Add files
    if (files) {
      Array.from(files).forEach(file => {
        formData.append("files", file);
      });
    }

    const response = await fetch("/api/quejas", {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Error creating complaint");
    }

    return response.json();
  },

  getAll: async (): Promise<any> => {
    const response = await apiRequest("GET", "/api/quejas");
    return response.json();
  },

  getById: async (id: number): Promise<any> => {
    const response = await apiRequest("GET", `/api/quejas/${id}`);
    return response.json();
  },

  update: async (id: number, data: Partial<QuejaData>): Promise<any> => {
    const response = await apiRequest("PUT", `/api/quejas/${id}`, data);
    return response.json();
  },

  delete: async (id: number): Promise<void> => {
    await apiRequest("DELETE", `/api/quejas/${id}`);
  },
};
