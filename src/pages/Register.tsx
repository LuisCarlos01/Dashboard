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
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  ArrowForward,
  ArrowBack,
  Google,
  Facebook,
  GitHub,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";

const Register = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { register, loginWithSocial, loading } = useAuth();
  const { addNotification } = useNotifications();

  // Estado para controlar o passo atual do formulário
  const [activeStep, setActiveStep] = useState(0);

  // Estados para os campos do formulário
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  // Estado para controlar os erros de validação
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Passos do formulário de registro
  const steps = ["Informações Pessoais", "Credenciais de Acesso"];

  const validateStep1 = () => {
    let valid = true;
    const newErrors = { ...errors };

    // Validação do nome
    if (!name.trim()) {
      newErrors.name = "Nome é obrigatório";
      valid = false;
    } else if (name.trim().length < 3) {
      newErrors.name = "Nome deve ter pelo menos 3 caracteres";
      valid = false;
    } else {
      newErrors.name = "";
    }

    setErrors(newErrors);
    return valid;
  };

  const validateStep2 = () => {
    let valid = true;
    const newErrors = { ...errors };

    // Validação de email
    if (!email) {
      newErrors.email = "Email é obrigatório";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email inválido";
      valid = false;
    } else {
      newErrors.email = "";
    }

    // Validação de senha
    if (!password) {
      newErrors.password = "Senha é obrigatória";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres";
      valid = false;
    } else {
      newErrors.password = "";
    }

    // Validação de confirmação de senha
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
      valid = false;
    } else {
      newErrors.confirmPassword = "";
    }

    setErrors(newErrors);
    return valid;
  };

  const handleNext = () => {
    if (activeStep === 0 && validateStep1()) {
      setActiveStep(1);
    }
  };

  const handleBack = () => {
    setActiveStep(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeStep === 1 && validateStep2()) {
      const success = await register(name, email, password);
      if (success) {
        navigate("/login");
      }
    }
  };

  // Registro com redes sociais
  const handleSocialRegister = async (provider: string) => {
    setSocialLoading(provider);

    try {
      // Usamos a mesma função de login social, já que o backend trata ambos os casos
      const success = await loginWithSocial(provider);
      if (success) {
        navigate("/");
      }
    } finally {
      setSocialLoading(null);
    }
  };

  // Renderização do conteúdo baseado no passo atual
  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              id="name"
              label="Nome Completo"
              name="name"
              autoComplete="name"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForward />}
                sx={{ borderRadius: 2 }}
              >
                Próximo
              </Button>
            </Box>
          </>
        );
      case 1:
        return (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirmar Senha"
              type={showConfirmPassword ? "text" : "password"}
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
            >
              <Button
                onClick={handleBack}
                startIcon={<ArrowBack />}
                sx={{ borderRadius: 2 }}
              >
                Voltar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !!socialLoading}
                sx={{ borderRadius: 2 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Registrar"
                )}
              </Button>
            </Box>
          </>
        );
      default:
        return null;
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
              Criar uma conta
            </Typography>

            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
              {getStepContent(activeStep)}
            </Box>

            <Box sx={{ mt: 3, textAlign: "center" }}>
              <Typography variant="body2">
                Já tem uma conta?{" "}
                <Link component={RouterLink} to="/login" fontWeight="bold">
                  Faça login
                </Link>
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                ou registre-se com
              </Typography>
            </Divider>

            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <IconButton
                sx={{
                  bgcolor: "#DB4437",
                  color: "white",
                  "&:hover": { bgcolor: "#C5382F" },
                }}
                onClick={() => handleSocialRegister("Google")}
                disabled={!!socialLoading || loading}
                aria-label="Registrar com Google"
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
                onClick={() => handleSocialRegister("Facebook")}
                disabled={!!socialLoading || loading}
                aria-label="Registrar com Facebook"
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
                onClick={() => handleSocialRegister("GitHub")}
                disabled={!!socialLoading || loading}
                aria-label="Registrar com GitHub"
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

export default Register;
