import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Slider,
  Button,
  TextField,
  IconButton,
  Avatar,
  useTheme,
  Fade,
  Card,
  CardContent,
  Stack,
  Alert,
  Chip,
} from "@mui/material";
import {
  Save as SaveIcon,
  RestartAlt as ResetIcon,
  Notifications as NotificationsIcon,
  Palette as PaletteIcon,
  Security as SecurityIcon,
  Storage as StorageIcon,
  Visibility as VisibilityIcon,
  Language as LanguageIcon,
  Tune as TuneIcon,
  CloudUpload as CloudUploadIcon,
  AccessTime as AccessTimeIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useThemeContext } from "../contexts/ThemeContext";
import { useNotifications } from "../contexts/NotificationContext";

// Mock de dados padrão
const defaultSettings = {
  notifications: {
    email: true,
    push: true,
    desktop: true,
    soundEnabled: true,
    notificationDuration: 5,
  },
  appearance: {
    density: "comfortable",
    fontSize: "medium",
    colorAccent: "#6c63ff",
    animations: true,
  },
  privacy: {
    shareUsageData: false,
    allowCookies: true,
    dataRetention: 30,
  },
  language: "pt-BR",
  dataSaving: {
    lowImageQuality: false,
    autoSync: true,
    syncInterval: 15,
  },
};

// Componente para cada seção de configurações
interface SettingsSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const SettingsSection = ({ title, icon, children }: SettingsSectionProps) => {
  const theme = useTheme();

  return (
    <Card
      elevation={0}
      sx={{
        mb: 3,
        borderRadius: 2,
        border: `1px solid ${theme.palette.divider}`,
        "&:hover": {
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        },
        transition: "box-shadow 0.3s ease",
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Avatar
            sx={{
              mr: 2,
              bgcolor: "primary.main",
              color: "white",
            }}
          >
            {icon}
          </Avatar>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        <Divider sx={{ mb: 3 }} />
        {children}
      </CardContent>
    </Card>
  );
};

const Settings = () => {
  const theme = useTheme();
  const { mode } = useThemeContext();
  const { addNotification } = useNotifications();

  // Estado para armazenar todas as configurações
  const [settings, setSettings] = useState(defaultSettings);
  const [isModified, setIsModified] = useState(false);

  // Funções para atualizar as configurações
  const handleNotificationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = event.target;
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [name]: checked,
      },
    });
    setIsModified(true);
  };

  const handleNotificationDurationChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        notificationDuration: newValue as number,
      },
    });
    setIsModified(true);
  };

  const handleAppearanceChange = (name: string, value: any) => {
    setSettings({
      ...settings,
      appearance: {
        ...settings.appearance,
        [name]: value,
      },
    });
    setIsModified(true);
  };

  const handlePrivacyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    setSettings({
      ...settings,
      privacy: {
        ...settings.privacy,
        [name]: checked,
      },
    });
    setIsModified(true);
  };

  const handleDataRetentionChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    setSettings({
      ...settings,
      privacy: {
        ...settings.privacy,
        dataRetention: newValue as number,
      },
    });
    setIsModified(true);
  };

  const handleLanguageChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setSettings({
      ...settings,
      language: event.target.value as string,
    });
    setIsModified(true);
  };

  const handleDataSavingChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, checked } = event.target;
    setSettings({
      ...settings,
      dataSaving: {
        ...settings.dataSaving,
        [name]: checked,
      },
    });
    setIsModified(true);
  };

  const handleSyncIntervalChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    setSettings({
      ...settings,
      dataSaving: {
        ...settings.dataSaving,
        syncInterval: newValue as number,
      },
    });
    setIsModified(true);
  };

  // Funções para salvar ou resetar configurações
  const handleSaveSettings = () => {
    addNotification({
      message: "Configurações salvas com sucesso",
      severity: "success",
    });
    setIsModified(false);
  };

  const handleResetSettings = () => {
    setSettings(defaultSettings);
    addNotification({
      message: "Configurações restauradas para os valores padrão",
      severity: "info",
    });
    setIsModified(false);
  };

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ py: 3, maxWidth: 1200, mx: "auto" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
              Configurações
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Personalize o sistema de acordo com suas preferências
            </Typography>
          </Box>

          <Box>
            <Button
              variant="outlined"
              startIcon={<ResetIcon />}
              sx={{ mr: 2, borderRadius: 2 }}
              disabled={!isModified}
              onClick={handleResetSettings}
            >
              Restaurar
            </Button>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              sx={{ borderRadius: 2 }}
              disabled={!isModified}
              onClick={handleSaveSettings}
            >
              Salvar Configurações
            </Button>
          </Box>
        </Box>

        {isModified && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Alert severity="warning" sx={{ mb: 3 }}>
              Você tem alterações não salvas. Clique em "Salvar Configurações"
              para aplicar as mudanças.
            </Alert>
          </motion.div>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            {/* Seção de Notificações */}
            <SettingsSection title="Notificações" icon={<NotificationsIcon />}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.email}
                        onChange={handleNotificationChange}
                        name="email"
                        color="primary"
                      />
                    }
                    label="Notificações por e-mail"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.push}
                        onChange={handleNotificationChange}
                        name="push"
                        color="primary"
                      />
                    }
                    label="Notificações push"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.desktop}
                        onChange={handleNotificationChange}
                        name="desktop"
                        color="primary"
                      />
                    }
                    label="Notificações na área de trabalho"
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications.soundEnabled}
                        onChange={handleNotificationChange}
                        name="soundEnabled"
                        color="primary"
                      />
                    }
                    label="Sons para notificações"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Duração das notificações (segundos)
                  </Typography>
                  <Slider
                    value={settings.notifications.notificationDuration}
                    onChange={handleNotificationDurationChange}
                    aria-labelledby="duration-slider"
                    valueLabelDisplay="auto"
                    step={1}
                    marks
                    min={1}
                    max={10}
                    sx={{ maxWidth: 400 }}
                  />
                </Grid>
              </Grid>
            </SettingsSection>

            {/* Seção de Aparência */}
            <SettingsSection title="Aparência" icon={<PaletteIcon />}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="density-label">Densidade</InputLabel>
                    <Select
                      labelId="density-label"
                      id="density-select"
                      value={settings.appearance.density}
                      label="Densidade"
                      onChange={(e) =>
                        handleAppearanceChange("density", e.target.value)
                      }
                    >
                      <MenuItem value="compact">Compacta</MenuItem>
                      <MenuItem value="comfortable">Confortável</MenuItem>
                      <MenuItem value="spacious">Espaçosa</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="font-size-label">
                      Tamanho da fonte
                    </InputLabel>
                    <Select
                      labelId="font-size-label"
                      id="font-size-select"
                      value={settings.appearance.fontSize}
                      label="Tamanho da fonte"
                      onChange={(e) =>
                        handleAppearanceChange("fontSize", e.target.value)
                      }
                    >
                      <MenuItem value="small">Pequena</MenuItem>
                      <MenuItem value="medium">Média</MenuItem>
                      <MenuItem value="large">Grande</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.appearance.animations}
                        onChange={(e) =>
                          handleAppearanceChange("animations", e.target.checked)
                        }
                        name="animations"
                        color="primary"
                      />
                    }
                    label="Animações e transições"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Cor de destaque personalizada
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        bgcolor: settings.appearance.colorAccent,
                        mr: 2,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    />
                    <TextField
                      type="color"
                      value={settings.appearance.colorAccent}
                      onChange={(e) =>
                        handleAppearanceChange("colorAccent", e.target.value)
                      }
                      sx={{ width: 160 }}
                      InputProps={{
                        startAdornment: (
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            #
                          </Typography>
                        ),
                      }}
                    />
                    <Button
                      variant="text"
                      size="small"
                      sx={{ ml: 1 }}
                      onClick={() =>
                        handleAppearanceChange("colorAccent", "#6c63ff")
                      }
                    >
                      Restaurar
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </SettingsSection>

            {/* Seção de Privacidade */}
            <SettingsSection
              title="Privacidade e Segurança"
              icon={<SecurityIcon />}
            >
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.privacy.shareUsageData}
                        onChange={handlePrivacyChange}
                        name="shareUsageData"
                        color="primary"
                      />
                    }
                    label="Compartilhar dados de uso anônimos para melhorar o sistema"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.privacy.allowCookies}
                        onChange={handlePrivacyChange}
                        name="allowCookies"
                        color="primary"
                      />
                    }
                    label="Permitir cookies para melhorar a experiência"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Período de retenção de dados (dias)
                  </Typography>
                  <Slider
                    value={settings.privacy.dataRetention}
                    onChange={handleDataRetentionChange}
                    aria-labelledby="retention-slider"
                    valueLabelDisplay="auto"
                    step={15}
                    marks
                    min={15}
                    max={365}
                    sx={{ maxWidth: 400 }}
                  />
                </Grid>
              </Grid>
            </SettingsSection>
          </Grid>

          <Grid item xs={12} lg={4}>
            {/* Seção de Idioma */}
            <SettingsSection title="Idioma" icon={<LanguageIcon />}>
              <FormControl fullWidth size="small">
                <InputLabel id="language-label">Idioma</InputLabel>
                <Select
                  labelId="language-label"
                  id="language-select"
                  value={settings.language}
                  label="Idioma"
                  onChange={handleLanguageChange}
                >
                  <MenuItem value="pt-BR">Português (Brasil)</MenuItem>
                  <MenuItem value="en-US">English (United States)</MenuItem>
                  <MenuItem value="es-ES">Español</MenuItem>
                  <MenuItem value="fr-FR">Français</MenuItem>
                </Select>
              </FormControl>
              <Box sx={{ mt: 2 }}>
                <Chip
                  label="Atual: Português"
                  color="primary"
                  size="small"
                  variant="outlined"
                />
              </Box>
            </SettingsSection>

            {/* Seção de Dados */}
            <SettingsSection title="Economia de Dados" icon={<StorageIcon />}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.dataSaving.lowImageQuality}
                        onChange={handleDataSavingChange}
                        name="lowImageQuality"
                        color="primary"
                      />
                    }
                    label="Carregar imagens em baixa qualidade"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.dataSaving.autoSync}
                        onChange={handleDataSavingChange}
                        name="autoSync"
                        color="primary"
                      />
                    }
                    label="Sincronização automática"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" gutterBottom>
                    Intervalo de sincronização (minutos)
                  </Typography>
                  <Slider
                    value={settings.dataSaving.syncInterval}
                    onChange={handleSyncIntervalChange}
                    aria-labelledby="sync-slider"
                    valueLabelDisplay="auto"
                    step={5}
                    marks
                    min={5}
                    max={60}
                    disabled={!settings.dataSaving.autoSync}
                  />
                </Grid>
              </Grid>
            </SettingsSection>

            {/* Seção de Preferências do Sistema */}
            <SettingsSection
              title="Preferências do Sistema"
              icon={<TuneIcon />}
            >
              <Stack spacing={2}>
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Tema
                  </Typography>
                  <Chip
                    icon={
                      mode === "light" ? <VisibilityIcon /> : <VisibilityIcon />
                    }
                    label={mode === "light" ? "Claro" : "Escuro"}
                    variant="outlined"
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Para alterar o tema, use o botão na barra superior
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Fuso Horário
                  </Typography>
                  <Chip
                    icon={<AccessTimeIcon />}
                    label="São Paulo (GMT-3)"
                    variant="outlined"
                    size="small"
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Exportar Dados
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<CloudUploadIcon />}
                    sx={{ textTransform: "none", borderRadius: 2 }}
                  >
                    Exportar Configurações
                  </Button>
                </Box>
              </Stack>
            </SettingsSection>
          </Grid>
        </Grid>
      </Box>
    </Fade>
  );
};

export default Settings;
