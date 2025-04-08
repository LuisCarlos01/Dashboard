import React, { createContext, useState, useContext, useEffect } from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

// Tipos para as notificações
export interface Notification {
  id: string;
  message: string;
  severity: AlertColor;
  read: boolean;
  time: string;
  autoHide?: boolean;
  duration?: number;
}

// Interface do contexto
interface NotificationContextType {
  notifications: Notification[];
  addNotification: (
    notification: Omit<Notification, "id" | "time" | "read">
  ) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

// Criação do contexto com valores padrão
const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  addNotification: () => {},
  removeNotification: () => {},
  markAsRead: () => {},
  markAllAsRead: () => {},
  clearAll: () => {},
});

// Hook para facilitar o uso do contexto
export const useNotifications = () => useContext(NotificationContext);

// Componente de provider do contexto
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Estado para armazenar as notificações
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Estado para exibir snackbar
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({
    open: false,
    message: "",
    severity: "info",
  });

  // Carregar notificações do localStorage ao montar o componente
  useEffect(() => {
    try {
      const savedNotifications = localStorage.getItem("notifications");
      if (savedNotifications) {
        setNotifications(JSON.parse(savedNotifications));
      }
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    }
  }, []);

  // Salvar notificações no localStorage quando atualizar
  useEffect(() => {
    try {
      localStorage.setItem("notifications", JSON.stringify(notifications));
    } catch (error) {
      console.error("Erro ao salvar notificações:", error);
    }
  }, [notifications]);

  // Função para adicionar uma nova notificação
  const addNotification = (
    notification: Omit<Notification, "id" | "time" | "read">
  ) => {
    const id = `notification-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date();

    const newNotification: Notification = {
      id,
      message: notification.message,
      severity: notification.severity,
      read: false,
      time: now.toISOString(),
      autoHide: notification.autoHide !== false, // Default: true
      duration: notification.duration || 5000, // Default: 5000ms
    };

    setNotifications((prev) => [newNotification, ...prev]);

    // Mostrar snackbar para a nova notificação
    if (newNotification.autoHide) {
      setSnackbar({
        open: true,
        message: newNotification.message,
        severity: newNotification.severity,
      });
    }
  };

  // Função para remover uma notificação pelo ID
  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  // Função para marcar uma notificação como lida
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Função para marcar todas notificações como lidas
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  // Função para limpar todas as notificações
  const clearAll = () => {
    setNotifications([]);
  };

  // Fechar snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Formatar data de notificação em formato relativo (ex: "há 5 minutos")
  const formatRelativeTime = (isoTime: string): string => {
    const now = new Date();
    const time = new Date(isoTime);
    const diffMs = now.getTime() - time.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return "agora";
    if (diffMin < 60)
      return `há ${diffMin} ${diffMin === 1 ? "minuto" : "minutos"}`;
    if (diffHour < 24)
      return `há ${diffHour} ${diffHour === 1 ? "hora" : "horas"}`;
    if (diffDay < 30) return `há ${diffDay} ${diffDay === 1 ? "dia" : "dias"}`;

    return time.toLocaleDateString("pt-BR");
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications: notifications.map((notification) => ({
          ...notification,
          time: formatRelativeTime(notification.time),
        })),
        addNotification,
        removeNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
      }}
    >
      {children}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
