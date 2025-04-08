import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export interface DashboardMetrics {
  kpis: {
    revenue: {
      value: string;
      trend: { value: number; isPositive: boolean };
    };
    users: {
      value: string;
      trend: { value: number; isPositive: boolean };
    };
    orders: {
      value: string;
      trend: { value: number; isPositive: boolean };
    };
    avgTicket: {
      value: string;
      trend: { value: number; isPositive: boolean };
    };
  };
  salesData: Array<{ label: string; value: number }>;
  categoryData: Array<{ label: string; value: number }>;
}

export interface User {
  id: number;
  name: string;
  email: string;
  type: "admin" | "user";
}

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
}

export interface Sale {
  id: number;
  product_id: number;
  user_id: number;
  value: number;
  date: string;
}

// Endpoints da API
export const api_endpoints = {
  // Dashboard
  getDashboardMetrics: async (
    period: "week" | "month" | "year"
  ): Promise<DashboardMetrics> => {
    const { data } = await api.get(`/dashboard/metrics?period=${period}`);
    return data;
  },

  // Usuários
  getUsers: async () => {
    const { data } = await api.get<User[]>("/users");
    return data;
  },

  createUser: async (user: Omit<User, "id">) => {
    const { data } = await api.post<User>("/users", user);
    return data;
  },

  updateUser: async (id: number, user: Partial<User>) => {
    const { data } = await api.put<User>(`/users/${id}`, user);
    return data;
  },

  deleteUser: async (id: number) => {
    await api.delete(`/users/${id}`);
  },

  // Produtos
  getProducts: async () => {
    const { data } = await api.get<Product[]>("/products");
    return data;
  },

  createProduct: async (product: Omit<Product, "id">) => {
    const { data } = await api.post<Product>("/products", product);
    return data;
  },

  updateProduct: async (id: number, product: Partial<Product>) => {
    const { data } = await api.put<Product>(`/products/${id}`, product);
    return data;
  },

  deleteProduct: async (id: number) => {
    await api.delete(`/products/${id}`);
  },

  // Vendas
  getSales: async () => {
    const { data } = await api.get<Sale[]>("/sales");
    return data;
  },

  createSale: async (sale: Omit<Sale, "id">) => {
    const { data } = await api.post<Sale>("/sales", sale);
    return data;
  },
};

export default api;
