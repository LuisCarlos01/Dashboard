import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Link,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  useTheme,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Google,
  Facebook,
  GitHub,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";

const Login = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { login, loginWithSocial, loading } = useAuth();
  const { addNotification } = useNotifications();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validação básica
    if (!email.trim() || !password.trim()) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    // Tenta realizar o login
    const success = await login(email, password);
    if (success) {
      navigate("/");
    }
  };

  // Login social
  const handleSocialLogin = async (provider: string) => {
    setSocialLoading(provider);

    try {
      const success = await loginWithSocial(provider);
      if (success) {
        navigate("/");
      }
    } finally {
      setSocialLoading(null);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            mt: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{
              mb: 4,
              fontWeight: 700,
              background: "linear-gradient(90deg, #3a7bd5, #6c63ff)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            DASHBOARD
          </Typography>

          <Paper
            elevation={3}
            sx={{
              p: 4,
              width: "100%",
              borderRadius: 2,
              boxShadow:
                theme.palette.mode === "dark"
                  ? "0 8px 32px rgba(0, 0, 0, 0.3)"
                  : "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography
              component="h2"
              variant="h5"
              sx={{ mb: 3, fontWeight: 600, textAlign: "center" }}
            >
              Acessar Conta
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Senha"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 1,
                }}
              >
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  variant="body2"
                  sx={{ color: "primary.main" }}
                >
                  Esqueceu a senha?
                </Link>
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  borderRadius: 2,
                  height: 48,
                  bgcolor: "primary.main",
                  "&:hover": { bgcolor: "primary.dark" },
                }}
                disabled={loading || !!socialLoading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Entrar"
                )}
              </Button>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2">
                  Não tem uma conta?{" "}
                  <Link component={RouterLink} to="/register" fontWeight="bold">
                    Cadastre-se
                  </Link>
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                ou entre com
              </Typography>
            </Divider>

            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <IconButton
                sx={{
                  bgcolor: "#DB4437",
                  color: "white",
                  "&:hover": { bgcolor: "#C5382F" },
                }}
                onClick={() => handleSocialLogin("Google")}
                disabled={!!socialLoading || loading}
                aria-label="Entrar com Google"
              >
                {socialLoading === "Google" ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <Google />
                )}
              </IconButton>
              <IconButton
                sx={{
                  bgcolor: "#4267B2",
                  color: "white",
                  "&:hover": { bgcolor: "#365899" },
                }}
                onClick={() => handleSocialLogin("Facebook")}
                disabled={!!socialLoading || loading}
                aria-label="Entrar com Facebook"
              >
                {socialLoading === "Facebook" ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <Facebook />
                )}
              </IconButton>
              <IconButton
                sx={{
                  bgcolor: "#333",
                  color: "white",
                  "&:hover": { bgcolor: "#222" },
                }}
                onClick={() => handleSocialLogin("GitHub")}
                disabled={!!socialLoading || loading}
                aria-label="Entrar com GitHub"
              >
                {socialLoading === "GitHub" ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <GitHub />
                )}
              </IconButton>
            </Box>
          </Paper>
        </Box>

        <Box sx={{ mt: 6, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            © 2024 Dashboard. Todos os direitos reservados.
          </Typography>
        </Box>
      </motion.div>
    </Container>
  );
};

export default Login;
