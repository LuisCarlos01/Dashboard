import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "./NotificationContext";
import axios from "axios";

// Interfaces para autenticação OAuth
interface OAuthProvider {
  id: string;
  name: string;
}

// Interface para o usuário
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "user";
  avatar?: string;
  createdAt: string;
  lastLogin?: string;
  oauthProviders?: OAuthProvider[];
  preferences?: {
    notifications: boolean;
    darkMode?: boolean;
  };
}

// Interface para o contexto de autenticação
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  loginWithSocial: (provider: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => Promise<boolean>;
  updatePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<boolean>;
}

// URL da API
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Mock de usuários para simulação
const MOCK_USERS = [
  {
    id: "1",
    name: "Admin",
    email: "admin@exemplo.com",
    password: "admin123",
    role: "admin",
    avatar: "",
    createdAt: "2023-01-15T10:30:00",
    lastLogin: "2024-04-25T08:45:00",
    preferences: {
      notifications: true,
      darkMode: false,
    },
  },
  {
    id: "2",
    name: "Usuário Teste",
    email: "usuario@exemplo.com",
    password: "senha123",
    role: "user",
    avatar: "",
    createdAt: "2023-03-20T14:20:00",
    lastLogin: "2024-04-24T16:30:00",
    preferences: {
      notifications: true,
      darkMode: true,
    },
  },
];

// Hook para usar o contexto
export const useAuth = () => useContext(AuthContext);

// Criar o contexto
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  isAuthenticated: false,
  login: async () => false,
  register: async () => false,
  loginWithSocial: async () => false,
  logout: () => {},
  updateUserProfile: async () => false,
  updatePassword: async () => false,
});

// Setup do Axios para interceptar erros 401 e fazer logout automático
const setupAxiosInterceptors = (logout: () => void) => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        logout();
      }
      return Promise.reject(error);
    }
  );
};

// Provider do contexto
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { addNotification } = useNotifications();

  // Função de logout
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    setUser(null);

    addNotification({
      message: "Você saiu da sua conta",
      severity: "info",
    });

    navigate("/login");
  };

  // Configurar interceptors do Axios
  useEffect(() => {
    setupAxiosInterceptors(logout);
  }, []);

  // Verificar se o usuário está logado ao carregar a página
  useEffect(() => {
    const checkAuth = () => {
      // Verificar token do localStorage (lembrar-me ativado)
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const storedUser =
        localStorage.getItem("user") || sessionStorage.getItem("user");

      if (token && storedUser) {
        try {
          // Configurar o token no cabeçalho padrão do Axios para futuras requisições
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error("Erro ao recuperar usuário:", error);
          localStorage.removeItem("user");
          localStorage.removeItem("token");
          sessionStorage.removeItem("user");
          sessionStorage.removeItem("token");
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // Função de login
  const login = async (
    email: string,
    password: string,
    rememberMe = false
  ): Promise<boolean> => {
    setLoading(true);

    try {
      // Fazer requisição real para o backend
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      const { token, user: userData } = response.data;

      // Salvar o token para autenticação
      if (rememberMe) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", JSON.stringify(userData));
      }

      // Configurar o token no cabeçalho padrão do Axios para futuras requisições
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(userData);

      addNotification({
        message: `Bem-vindo, ${userData.name || userData.email}!`,
        severity: "success",
      });

      return true;
    } catch (error: any) {
      console.error("Erro durante login:", error);

      // Exibir mensagem de erro específica do servidor, se disponível
      const errorMessage =
        error.response?.data?.message ||
        "Erro durante o login. Verifique suas credenciais e tente novamente.";

      addNotification({
        message: errorMessage,
        severity: "error",
      });

      return false;
    } finally {
      setLoading(false);
    }
  };

  // Função para login com redes sociais
  const loginWithSocial = async (provider: string): Promise<boolean> => {
    setLoading(true);

    try {
      // Em produção, aqui usaríamos Firebase, Auth0 ou outra biblioteca OAuth
      // Esta é uma simulação para demonstração

      // 1. Abrir janela popup para autenticação
      const authWindow = window.open(
        `${API_URL}/auth/${provider.toLowerCase()}`,
        `${provider} Login`,
        "width=500,height=600"
      );

      // 2. Configurar evento para receber o token após autenticação bem-sucedida
      const receiveMessage = (event: MessageEvent) => {
        // Verificar origem da mensagem (em produção, usar origin exata)
        if (event.origin !== window.location.origin) return;

        if (event.data.type === "auth_success") {
          const { token, user: userData } = event.data;

          // Salvar token e dados do usuário
          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(userData));

          // Configurar Axios
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

          // Atualizar estado
          setUser(userData);

          // Fechar popup
          if (authWindow) authWindow.close();

          addNotification({
            message: `Login com ${provider} realizado com sucesso!`,
            severity: "success",
          });

          window.removeEventListener("message", receiveMessage);
          setLoading(false);
          return true;
        }
      };

      window.addEventListener("message", receiveMessage);

      // Simulação de autenticação
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Dados mockados para simulação de login
      const mockUserData = {
        id: `social-${Date.now()}`,
        name:
          provider === "Google"
            ? "Usuário Google"
            : provider === "Facebook"
            ? "Usuário Facebook"
            : "Usuário GitHub",
        email: `usuario.${provider.toLowerCase()}@exemplo.com`,
        role: "user",
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        oauthProviders: [{ id: provider.toLowerCase(), name: provider }],
        preferences: {
          notifications: true,
          darkMode: false,
        },
      };

      const mockToken = `mock_${provider.toLowerCase()}_token_${Date.now()}`;

      // Salvar token e dados do usuário
      localStorage.setItem("token", mockToken);
      localStorage.setItem("user", JSON.stringify(mockUserData));

      // Configurar Axios
      axios.defaults.headers.common["Authorization"] = `Bearer ${mockToken}`;

      // Atualizar estado
      setUser(mockUserData);

      window.removeEventListener("message", receiveMessage);

      addNotification({
        message: `Login com ${provider} realizado com sucesso!`,
        severity: "success",
      });

      return true;
    } catch (error) {
      console.error(`Erro durante login com ${provider}:`, error);
      addNotification({
        message: `Erro ao autenticar com ${provider}. Tente novamente.`,
        severity: "error",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Função de registro
  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    setLoading(true);

    try {
      // Em produção, aqui faríamos uma requisição real para o backend
      // Como o endpoint de registro não está implementado no backend fornecido,
      // vamos usar uma simulação

      await new Promise((resolve) => setTimeout(resolve, 1500));

      addNotification({
        message: "Conta criada com sucesso! Você já pode fazer login.",
        severity: "success",
      });

      return true;
    } catch (error: any) {
      console.error("Erro durante registro:", error);

      // Exibir mensagem de erro específica do servidor, se disponível
      const errorMessage =
        error.response?.data?.message ||
        "Erro ao criar conta. Tente novamente mais tarde.";

      addNotification({
        message: errorMessage,
        severity: "error",
      });

      return false;
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar o perfil do usuário
  const updateUserProfile = async (
    userData: Partial<User>
  ): Promise<boolean> => {
    setLoading(true);

    try {
      if (!user) {
        return false;
      }

      // Em produção, aqui faríamos uma requisição real para o backend
      // Como o endpoint de atualização de perfil não está implementado no backend fornecido,
      // vamos usar uma simulação

      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Atualizar usuário
      const updatedUser = { ...user, ...userData };

      // Salvar nos storages
      if (localStorage.getItem("user")) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
      if (sessionStorage.getItem("user")) {
        sessionStorage.setItem("user", JSON.stringify(updatedUser));
      }

      setUser(updatedUser);

      addNotification({
        message: "Perfil atualizado com sucesso",
        severity: "success",
      });

      return true;
    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error);

      // Exibir mensagem de erro específica do servidor, se disponível
      const errorMessage =
        error.response?.data?.message ||
        "Erro ao atualizar perfil. Tente novamente mais tarde.";

      addNotification({
        message: errorMessage,
        severity: "error",
      });

      return false;
    } finally {
      setLoading(false);
    }
  };

  // Função para atualizar a senha
  const updatePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    setLoading(true);

    try {
      // Em produção, aqui faríamos uma requisição real para o backend
      // Como o endpoint de atualização de senha não está implementado no backend fornecido,
      // vamos usar uma simulação

      await new Promise((resolve) => setTimeout(resolve, 1000));

      addNotification({
        message: "Senha atualizada com sucesso",
        severity: "success",
      });

      return true;
    } catch (error: any) {
      console.error("Erro ao atualizar senha:", error);

      // Exibir mensagem de erro específica do servidor, se disponível
      const errorMessage =
        error.response?.data?.message ||
        "Erro ao atualizar senha. Tente novamente mais tarde.";

      addNotification({
        message: errorMessage,
        severity: "error",
      });

      return false;
    } finally {
      setLoading(false);
    }
  };

  // Exportar o provider com os valores
  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        loginWithSocial,
        logout,
        updateUserProfile,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
