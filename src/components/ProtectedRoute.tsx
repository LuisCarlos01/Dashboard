import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { CircularProgress, Box } from "@mui/material";

/**
 * Componente para proteger rotas que requerem autenticação
 * Se o usuário não estiver autenticado, redireciona para a página de login
 * Se estiver carregando o status de autenticação, mostra um indicador de carregamento
 */
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Se ainda estiver carregando, mostra um indicador de progresso
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Se não estiver autenticado, redireciona para o login
  if (!isAuthenticated) {
    // Salva a localização atual para redirecionar de volta após o login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se estiver autenticado, renderiza o conteúdo da rota
  return <Outlet />;
};

export default ProtectedRoute;
