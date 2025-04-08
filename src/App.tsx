import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { AnimatePresence } from "framer-motion";

import ThemeProvider from "./contexts/ThemeContext";
import NotificationProvider from "./contexts/NotificationContext";
import CartProvider from "./contexts/CartContext";
import AuthProvider from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Products from "./pages/Products";
import Sales from "./pages/Sales";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Help from "./pages/Help";

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <CartProvider>
          <Router>
            <AuthProvider>
              <CssBaseline />
              <AnimatePresence mode="wait">
                <Routes>
                  {/* Rotas públicas */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Rotas protegidas */}
                  <Route element={<ProtectedRoute />}>
                    <Route element={<MainLayout />}>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/users" element={<Users />} />
                      <Route path="/products" element={<Products />} />
                      <Route path="/sales" element={<Sales />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/help" element={<Help />} />
                    </Route>
                  </Route>

                  {/* Rota para páginas não encontradas */}
                  <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                  />
                </Routes>
              </AnimatePresence>
            </AuthProvider>
          </Router>
        </CartProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
