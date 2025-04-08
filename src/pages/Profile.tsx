import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Paper,
  Divider,
  IconButton,
  InputAdornment,
  Tabs,
  Tab,
  useTheme,
  Fade,
  CircularProgress,
  Badge,
  Alert,
  Chip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Work as WorkIcon,
  Cake as CakeIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
  Camera as CameraIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationContext";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

const Profile = () => {
  const theme = useTheme();
  const { user, updateUserProfile, updatePassword, loading } = useAuth();
  const { addNotification } = useNotifications();

  const [tabValue, setTabValue] = useState(0);
  const [editMode, setEditMode] = useState(false);

  // Estados para os dados do perfil
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    role: "",
    phone: "",
    location: "",
    company: "",
    birthday: "",
    bio: "",
  });

  // Estados para senha
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Estado para erros de validação
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Inicializar os dados do perfil quando o usuário for carregado
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
        phone: "11 98765-4321", // Dados fictícios para simulação
        location: "São Paulo, SP",
        company: "Empresa Exemplo Ltda.",
        birthday: "1990-01-01",
        bio: "Especialista em desenvolvimento de sistemas e apaixonado por tecnologia.",
      });
    }
  }, [user]);

  // Handler para mudança de tab
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handler para mudança nos campos do perfil
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  // Handler para mudança nos campos de senha
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  // Validar o formulário de perfil
  const validateProfileForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    // Validação do nome
    if (!profileData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
      valid = false;
    } else {
      newErrors.name = "";
    }

    // Validação de email
    if (!profileData.email) {
      newErrors.email = "Email é obrigatório";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
      newErrors.email = "Email inválido";
      valid = false;
    } else {
      newErrors.email = "";
    }

    // Validação de telefone (opcional)
    if (profileData.phone && !/^\d{2}\s\d{5}-\d{4}$/.test(profileData.phone)) {
      newErrors.phone = "Formato inválido (ex: 11 98765-4321)";
      valid = false;
    } else {
      newErrors.phone = "";
    }

    setErrors({ ...errors, ...newErrors });
    return valid;
  };

  // Validar o formulário de senha
  const validatePasswordForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    // Validação de senha atual
    if (!passwordData.currentPassword) {
      newErrors.currentPassword = "Senha atual é obrigatória";
      valid = false;
    } else {
      newErrors.currentPassword = "";
    }

    // Validação de nova senha
    if (!passwordData.newPassword) {
      newErrors.newPassword = "Nova senha é obrigatória";
      valid = false;
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "A senha deve ter pelo menos 6 caracteres";
      valid = false;
    } else {
      newErrors.newPassword = "";
    }

    // Validação de confirmação de senha
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
      valid = false;
    } else {
      newErrors.confirmPassword = "";
    }

    setErrors({ ...errors, ...newErrors });
    return valid;
  };

  // Handler para envio do formulário de perfil
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateProfileForm()) {
      return;
    }

    // Atualizar perfil (apenas os campos permitidos)
    const success = await updateUserProfile({
      name: profileData.name,
      email: profileData.email,
    });

    if (success) {
      setEditMode(false);
    }
  };

  // Handler para envio do formulário de senha
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    const success = await updatePassword(
      passwordData.currentPassword,
      passwordData.newPassword
    );

    if (success) {
      // Limpar campos de senha
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  // Handler para upload de foto (simulado)
  const handlePhotoUpload = () => {
    addNotification({
      message: "Recurso de upload de foto será implementado em breve",
      severity: "info",
    });
  };

  if (!user) {
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

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ py: 3, maxWidth: 1200, mx: "auto" }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
          Meu Perfil
        </Typography>

        <Grid container spacing={3}>
          {/* Coluna da Esquerda - Foto e informações básicas */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: 2,
                  textAlign: "center",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                }}
              >
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                    badgeContent={
                      <IconButton
                        size="small"
                        sx={{
                          bgcolor: "primary.main",
                          color: "white",
                          "&:hover": { bgcolor: "primary.dark" },
                        }}
                        onClick={handlePhotoUpload}
                      >
                        <CameraIcon fontSize="small" />
                      </IconButton>
                    }
                  >
                    <Avatar
                      sx={{
                        width: 120,
                        height: 120,
                        mx: "auto",
                        mb: 2,
                        bgcolor: "primary.main",
                        fontSize: "3rem",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                  </Badge>
                </Box>

                <Typography variant="h5" sx={{ fontWeight: 600 }}>
                  {user.name}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {user.email}
                </Typography>

                <Chip
                  label={user.role === "admin" ? "Administrador" : "Usuário"}
                  color={user.role === "admin" ? "primary" : "default"}
                  size="small"
                  sx={{ mt: 1 }}
                />

                <Divider sx={{ my: 2 }} />

                <Box sx={{ textAlign: "left" }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Último acesso:
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleString("pt-BR")
                      : "N/A"}
                  </Typography>

                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                    gutterBottom
                  >
                    Conta criada em:
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                  </Typography>
                </Box>
              </Paper>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                }}
              >
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Informações de Contato
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <PhoneIcon sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2">
                    {profileData.phone || "Não informado"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <LocationIcon sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2">
                    {profileData.location || "Não informado"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <WorkIcon sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2">
                    {profileData.company || "Não informado"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CakeIcon sx={{ color: "text.secondary", mr: 1 }} />
                  <Typography variant="body2">
                    {profileData.birthday
                      ? new Date(profileData.birthday).toLocaleDateString(
                          "pt-BR"
                        )
                      : "Não informado"}
                  </Typography>
                </Box>
              </Paper>
            </motion.div>
          </Grid>

          {/* Coluna da Direita - Tabs e formulários */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 2,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  overflow: "hidden",
                }}
              >
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    aria-label="profile tabs"
                    sx={{ px: 2 }}
                  >
                    <Tab label="Informações Pessoais" />
                    <Tab label="Segurança" />
                  </Tabs>
                </Box>

                {/* Tab de Informações Pessoais */}
                <TabPanel value={tabValue} index={0}>
                  <Box sx={{ p: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 3,
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Informações Pessoais
                      </Typography>
                      <Button
                        startIcon={editMode ? <SaveIcon /> : <EditIcon />}
                        onClick={() => !editMode && setEditMode(true)}
                        variant={editMode ? "contained" : "outlined"}
                        type={editMode ? "submit" : "button"}
                        form="profile-form"
                        sx={{ borderRadius: 2 }}
                      >
                        {editMode ? "Salvar" : "Editar"}
                      </Button>
                    </Box>

                    <form id="profile-form" onSubmit={handleProfileSubmit}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Nome completo"
                            name="name"
                            value={profileData.name}
                            onChange={handleProfileChange}
                            disabled={!editMode}
                            error={!!errors.name}
                            helperText={errors.name}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PersonIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                            disabled={!editMode}
                            error={!!errors.email}
                            helperText={errors.email}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <EmailIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Telefone"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleProfileChange}
                            disabled={!editMode}
                            error={!!errors.phone}
                            helperText={
                              errors.phone || "Formato: 11 98765-4321"
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <PhoneIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Localidade"
                            name="location"
                            value={profileData.location}
                            onChange={handleProfileChange}
                            disabled={!editMode}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LocationIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Empresa"
                            name="company"
                            value={profileData.company}
                            onChange={handleProfileChange}
                            disabled={!editMode}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <WorkIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Data de Nascimento"
                            name="birthday"
                            type="date"
                            value={profileData.birthday}
                            onChange={handleProfileChange}
                            disabled={!editMode}
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <CakeIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Biografia"
                            name="bio"
                            value={profileData.bio}
                            onChange={handleProfileChange}
                            disabled={!editMode}
                            multiline
                            rows={4}
                          />
                        </Grid>
                      </Grid>
                    </form>
                  </Box>
                </TabPanel>

                {/* Tab de Segurança */}
                <TabPanel value={tabValue} index={1}>
                  <Box sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                      Alterar Senha
                    </Typography>

                    <form onSubmit={handlePasswordSubmit}>
                      <Grid container spacing={2}>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Senha Atual"
                            name="currentPassword"
                            type={showPasswords.current ? "text" : "password"}
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            error={!!errors.currentPassword}
                            helperText={errors.currentPassword}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LockIcon />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() =>
                                      setShowPasswords({
                                        ...showPasswords,
                                        current: !showPasswords.current,
                                      })
                                    }
                                    edge="end"
                                  >
                                    {showPasswords.current ? (
                                      <VisibilityOffIcon />
                                    ) : (
                                      <VisibilityIcon />
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Nova Senha"
                            name="newPassword"
                            type={showPasswords.new ? "text" : "password"}
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            error={!!errors.newPassword}
                            helperText={errors.newPassword}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LockIcon />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() =>
                                      setShowPasswords({
                                        ...showPasswords,
                                        new: !showPasswords.new,
                                      })
                                    }
                                    edge="end"
                                  >
                                    {showPasswords.new ? (
                                      <VisibilityOffIcon />
                                    ) : (
                                      <VisibilityIcon />
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField
                            fullWidth
                            label="Confirmar Nova Senha"
                            name="confirmPassword"
                            type={showPasswords.confirm ? "text" : "password"}
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  <LockIcon />
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() =>
                                      setShowPasswords({
                                        ...showPasswords,
                                        confirm: !showPasswords.confirm,
                                      })
                                    }
                                    edge="end"
                                  >
                                    {showPasswords.confirm ? (
                                      <VisibilityOffIcon />
                                    ) : (
                                      <VisibilityIcon />
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Alert severity="info" sx={{ mb: 2 }}>
                            A senha deve ter pelo menos 6 caracteres e incluir
                            letras e números.
                          </Alert>

                          <Button
                            type="submit"
                            variant="contained"
                            disabled={loading}
                            startIcon={
                              loading ? (
                                <CircularProgress size={20} />
                              ) : (
                                <SaveIcon />
                              )
                            }
                            sx={{ borderRadius: 2 }}
                          >
                            Alterar Senha
                          </Button>
                        </Grid>
                      </Grid>
                    </form>
                  </Box>
                </TabPanel>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
};

export default Profile;
