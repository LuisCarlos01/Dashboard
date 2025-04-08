import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Avatar,
  Badge,
  Tooltip,
  Fade,
  Paper,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
  Button,
  InputBase,
  ClickAwayListener,
  Popper,
  Grow,
  MenuList,
  Autocomplete,
  TextField,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  NotificationsOutlined as NotificationsIcon,
  AccountCircleOutlined as AccountIcon,
  ChevronLeft as ChevronLeftIcon,
  Search as SearchIcon,
  SettingsOutlined as SettingsIcon,
  HelpOutline as HelpIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Notifications as NotificationsFilledIcon,
  Close as CloseIcon,
  ArrowForward as ArrowForwardIcon,
  QuestionAnswer as QuestionAnswerIcon,
  LibraryBooks as LibraryBooksIcon,
  LiveHelp as LiveHelpIcon,
  VideoLibrary as VideoLibraryIcon,
} from "@mui/icons-material";

import { useThemeContext } from "../contexts/ThemeContext";
import {
  useNotifications,
  Notification as NotificationType,
} from "../contexts/NotificationContext";
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import CartDrawer from "../components/CartDrawer";

const drawerWidth = 260;

interface MainLayoutProps {
  children: React.ReactNode;
}

// Dados de exemplo para sugestões de pesquisa
const searchSuggestions = [
  { label: "Dashboard", type: "página", route: "/dashboard" },
  { label: "Usuários", type: "página", route: "/users" },
  { label: "Produtos", type: "página", route: "/products" },
  { label: "Vendas", type: "página", route: "/sales" },
  { label: "Perfil", type: "página", route: "/profile" },
  { label: "Alterar senha", type: "ajuda", route: "/help#alterar-senha" },
  {
    label: "Exportar relatórios",
    type: "ajuda",
    route: "/help#exportar-relatorios",
  },
  {
    label: "Adicionar produtos",
    type: "ajuda",
    route: "/help#adicionar-produtos",
  },
  { label: "Configurações", type: "página", route: "/settings" },
  { label: "Ajuda e suporte", type: "página", route: "/help" },
];

const menuItems = [
  { text: "Dashboard", icon: <DashboardIcon />, path: "/" },
  { text: "Usuários", icon: <PeopleIcon />, path: "/users" },
  { text: "Produtos", icon: <InventoryIcon />, path: "/products" },
  { text: "Vendas", icon: <ShoppingCartIcon />, path: "/sales" },
];

// Opções de ajuda populares para exibir no popover de ajuda
const helpItems = [
  { text: "FAQs", icon: <QuestionAnswerIcon />, path: "/help#faqs" },
  { text: "Guias", icon: <LibraryBooksIcon />, path: "/help#guides" },
  { text: "Tutoriais", icon: <VideoLibraryIcon />, path: "/help#tutorials" },
  { text: "Suporte", icon: <LiveHelpIcon />, path: "/help#support" },
];

export default function MainLayout({ children }: MainLayoutProps) {
  const theme = useTheme();
  const { mode, toggleTheme } = useThemeContext();
  const { notifications, addNotification, markAsRead, markAllAsRead } =
    useNotifications();
  const { user, logout } = useAuth();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(!isMobile);
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);
  const { itemCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  // Estados para menus e notificações
  const [anchorElNotifications, setAnchorElNotifications] =
    useState<null | HTMLElement>(null);
  const [anchorElProfile, setAnchorElProfile] = useState<null | HTMLElement>(
    null
  );

  // Estado para a barra de pesquisa
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Estado para o menu de ajuda rápida
  const [helpMenuOpen, setHelpMenuOpen] = useState(false);
  const helpMenuRef = useRef<HTMLButtonElement>(null);

  // Conta número de notificações não lidas
  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location.pathname]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  // Funções para gerenciar menus
  const handleOpenNotifications = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNotifications(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setAnchorElNotifications(null);
  };

  const handleOpenProfile = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElProfile(event.currentTarget);
  };

  const handleCloseProfile = () => {
    setAnchorElProfile(null);
  };

  // Marcar todas notificações como lidas
  const handleMarkAllAsRead = () => {
    markAllAsRead();
    handleCloseNotifications();
    showFeedback("Todas notificações marcadas como lidas", "success");
  };

  // Função para exibir feedback ao usuário
  const showFeedback = (
    message: string,
    severity: "success" | "info" | "warning" | "error"
  ) => {
    addNotification({
      message,
      severity,
    });
  };

  // Função para logout
  const handleLogout = () => {
    handleCloseProfile();
    logout();
  };

  // Mudança de tema com feedback
  const handleThemeChange = () => {
    toggleTheme();
    showFeedback(
      `Tema ${mode === "light" ? "escuro" : "claro"} ativado`,
      "info"
    );
  };

  const handleOpenCart = () => {
    setCartOpen(true);
  };

  const handleCloseCart = () => {
    setCartOpen(false);
  };

  const handleNavigateToProfile = () => {
    navigate("/profile");
    handleCloseProfile();
  };

  const handleNavigateToSettings = () => {
    navigate("/settings");
    handleCloseProfile();
  };

  const handleNavigateToHelp = () => {
    navigate("/help");
  };

  // Função para abrir/fechar a barra de pesquisa
  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen) {
      setSearchQuery("");
    }
  };

  // Função para lidar com o clique fora da barra de pesquisa
  const handleSearchClickAway = () => {
    if (searchOpen && searchQuery.trim() === "") {
      setSearchOpen(false);
    }
  };

  // Função para lidar com a seleção de uma sugestão
  const handleSearchSelect = (event: any, value: any) => {
    if (value) {
      navigate(value.route);
      setSearchQuery("");
      setSearchOpen(false);
    }
  };

  // Função para abrir/fechar o menu de ajuda
  const handleToggleHelpMenu = () => {
    setHelpMenuOpen((prev) => !prev);
  };

  // Função para navegar para um item de ajuda
  const handleHelpItemClick = (path: string) => {
    navigate(path);
    setHelpMenuOpen(false);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(open && {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }),
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerToggle}
              edge="start"
              sx={{ mr: 2 }}
            >
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ fontWeight: 600 }}
            >
              Painel Administrativo
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <ClickAwayListener onClickAway={handleSearchClickAway}>
              <Box sx={{ position: "relative" }}>
                {searchOpen ? (
                  <Autocomplete
                    freeSolo
                    id="search-autocomplete"
                    options={searchSuggestions}
                    getOptionLabel={(option) =>
                      typeof option === "string" ? option : option.label
                    }
                    groupBy={(option) => option.type}
                    sx={{
                      width: { xs: 180, sm: 250, md: 300 },
                      "& .MuiOutlinedInput-root": {
                        py: 0.5,
                        backgroundColor: "background.paper",
                        borderRadius: 2,
                      },
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Pesquisar..."
                        variant="outlined"
                        size="small"
                        autoFocus
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon color="action" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton size="small" onClick={toggleSearch}>
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                    )}
                    onChange={handleSearchSelect}
                    renderOption={(props, option) => (
                      <MenuItem {...props}>
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          {option.type === "página" ? (
                            <DashboardIcon fontSize="small" />
                          ) : (
                            <HelpIcon fontSize="small" />
                          )}
                        </ListItemIcon>
                        <ListItemText
                          primary={option.label}
                          secondary={
                            option.type === "página" ? "Página" : "Ajuda"
                          }
                        />
                      </MenuItem>
                    )}
                  />
                ) : (
                  <Tooltip title="Pesquisar" arrow>
                    <IconButton
                      color="inherit"
                      size="large"
                      onClick={toggleSearch}
                    >
                      <SearchIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </ClickAwayListener>

            <Tooltip
              title={`Mudar para tema ${mode === "light" ? "escuro" : "claro"}`}
              arrow
            >
              <IconButton
                color="inherit"
                size="large"
                onClick={handleThemeChange}
              >
                {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Carrinho de Compras" arrow>
              <IconButton color="inherit" size="large" onClick={handleOpenCart}>
                <Badge badgeContent={itemCount} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Notificações" arrow>
              <IconButton
                color="inherit"
                size="large"
                onClick={handleOpenNotifications}
                aria-controls="notifications-menu"
                aria-haspopup="true"
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Tooltip>

            <Tooltip title="Configurações" arrow>
              <IconButton
                color="inherit"
                size="large"
                onClick={() => navigate("/settings")}
              >
                <SettingsIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Ajuda" arrow>
              <IconButton
                color="inherit"
                size="large"
                ref={helpMenuRef}
                onClick={handleToggleHelpMenu}
              >
                <HelpIcon />
              </IconButton>
            </Tooltip>

            <Popper
              open={helpMenuOpen}
              anchorEl={helpMenuRef.current}
              role={undefined}
              transition
              disablePortal
              placement="bottom-end"
              sx={{ zIndex: theme.zIndex.drawer + 2 }}
            >
              {({ TransitionProps }) => (
                <Grow
                  {...TransitionProps}
                  style={{ transformOrigin: "top right" }}
                >
                  <Paper sx={{ width: 320, p: 2, mt: 1 }}>
                    <ClickAwayListener
                      onClickAway={() => setHelpMenuOpen(false)}
                    >
                      <Box>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1,
                          }}
                        >
                          <Typography variant="subtitle1" fontWeight={600}>
                            Ajuda Rápida
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => setHelpMenuOpen(false)}
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Box>

                        <Divider sx={{ mb: 2 }} />

                        <List disablePadding>
                          {helpItems.map((item) => (
                            <ListItem
                              key={item.text}
                              disablePadding
                              sx={{ mb: 1 }}
                            >
                              <ListItemButton
                                onClick={() => handleHelpItemClick(item.path)}
                                sx={{
                                  borderRadius: 1,
                                  py: 1,
                                }}
                              >
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                  {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.text} />
                              </ListItemButton>
                            </ListItem>
                          ))}
                        </List>

                        <Button
                          variant="contained"
                          fullWidth
                          sx={{ mt: 1 }}
                          endIcon={<ArrowForwardIcon />}
                          onClick={() => {
                            navigate("/help");
                            setHelpMenuOpen(false);
                          }}
                        >
                          Central de Ajuda Completa
                        </Button>
                      </Box>
                    </ClickAwayListener>
                  </Paper>
                </Grow>
              )}
            </Popper>

            <Tooltip title="Perfil" arrow>
              <IconButton
                color="inherit"
                size="large"
                sx={{ ml: 1 }}
                onClick={handleOpenProfile}
                aria-controls="profile-menu"
                aria-haspopup="true"
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: "primary.dark",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase() || "A"}
                </Avatar>
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Menu de notificações */}
      <Menu
        id="notifications-menu"
        anchorEl={anchorElNotifications}
        open={Boolean(anchorElNotifications)}
        onClose={handleCloseNotifications}
        PaperProps={{
          sx: {
            width: 320,
            maxHeight: 400,
            mt: 1.5,
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Notificações
          </Typography>
          <Button
            size="small"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            Marcar todas como lidas
          </Button>
        </Box>
        <Divider />

        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={() => {
                markAsRead(notification.id);
                handleCloseNotifications();
              }}
              sx={{
                py: 1.5,
                backgroundColor: notification.read
                  ? "transparent"
                  : "action.hover",
                position: "relative",
                "&:hover": {
                  backgroundColor: notification.read
                    ? "action.hover"
                    : "action.selected",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  width: "100%",
                }}
              >
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: (() => {
                      switch (notification.severity) {
                        case "success":
                          return "success.main";
                        case "error":
                          return "error.main";
                        case "warning":
                          return "warning.main";
                        default:
                          return "primary.main";
                      }
                    })(),
                    mr: 2,
                  }}
                >
                  <NotificationsFilledIcon fontSize="small" />
                </Avatar>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: notification.read ? 400 : 600 }}
                  >
                    {notification.message}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {notification.time}
                  </Typography>
                </Box>
                {!notification.read && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      position: "absolute",
                      top: 16,
                      right: 16,
                    }}
                  />
                )}
              </Box>
            </MenuItem>
          ))
        ) : (
          <Box sx={{ p: 3, textAlign: "center" }}>
            <Typography color="text.secondary">Nenhuma notificação</Typography>
          </Box>
        )}
      </Menu>

      {/* Menu de perfil */}
      <Menu
        id="profile-menu"
        anchorEl={anchorElProfile}
        open={Boolean(anchorElProfile)}
        onClose={handleCloseProfile}
        PaperProps={{
          sx: { width: 200, mt: 1.5 },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={handleNavigateToProfile}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Meu Perfil
        </MenuItem>
        <MenuItem onClick={handleNavigateToSettings}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Configurações
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Sair
        </MenuItem>
      </Menu>

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={isMobile ? handleDrawerToggle : undefined}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            background:
              theme.palette.mode === "light"
                ? "linear-gradient(180deg, rgba(242,246,254,1) 0%, rgba(255,255,255,1) 100%)"
                : "linear-gradient(180deg, rgba(40,40,40,1) 0%, rgba(30,30,30,1) 100%)",
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 2,
            background: "linear-gradient(90deg, #3a7bd5, #6c63ff)",
          }}
        >
          <Typography
            variant="h5"
            component="div"
            sx={{
              color: "white",
              fontWeight: 700,
              textShadow: "0 2px 4px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "center",
            }}
          >
            DASHBOARD
          </Typography>
        </Toolbar>
        <Divider />

        <Box sx={{ p: 2 }}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              backgroundColor:
                theme.palette.mode === "light"
                  ? "rgba(106, 99, 255, 0.05)"
                  : "rgba(106, 99, 255, 0.15)",
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Avatar
              sx={{
                width: 42,
                height: 42,
                bgcolor: "primary.main",
                mr: 2,
              }}
            >
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {user?.name || "Admin"}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.role === "admin" ? "Administrador" : "Usuário"}
              </Typography>
            </Box>
          </Paper>
        </Box>

        <Divider textAlign="left" sx={{ px: 2, mt: 1 }}>
          <Typography
            variant="overline"
            sx={{
              color: "text.secondary",
              fontWeight: 600,
              fontSize: "0.75rem",
            }}
          >
            Menu Principal
          </Typography>
        </Divider>

        <Box sx={{ overflow: "auto", px: 2, py: 1 }}>
          <List>
            {menuItems.map((item) => {
              const isActive = currentPath === item.path;

              return (
                <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    onClick={() => {
                      navigate(item.path);
                      if (isMobile) setOpen(false);
                    }}
                    selected={isActive}
                    sx={{
                      borderRadius: 2,
                      py: 1,
                      ...(isActive && {
                        backgroundColor: "primary.main",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "primary.dark",
                        },
                        "& .MuiListItemIcon-root": {
                          color: "white",
                        },
                      }),
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: isActive ? "inherit" : "primary.main",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 600 : 500,
                      }}
                    />
                    {isActive && (
                      <Box
                        sx={{
                          width: 4,
                          height: 32,
                          backgroundColor: "white",
                          borderRadius: 4,
                          ml: 1,
                        }}
                      />
                    )}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ p: 2, mt: 2 }}>
          <Fade in={true} timeout={1000}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                backgroundColor:
                  theme.palette.mode === "light"
                    ? "#f0f7ff"
                    : "rgba(58, 123, 213, 0.2)",
                borderRadius: 2,
                border:
                  theme.palette.mode === "light"
                    ? "1px dashed #3a7bd5"
                    : "1px dashed rgba(58, 123, 213, 0.5)",
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                Precisa de ajuda?
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Consulte nossa central de ajuda para esclarecer suas dúvidas.
              </Typography>
              <Button
                variant="contained"
                fullWidth
                size="small"
                sx={{
                  borderRadius: 1,
                  textTransform: "none",
                  boxShadow: "none",
                }}
                onClick={() => navigate("/help")}
              >
                Central de Ajuda
              </Button>
            </Paper>
          </Fade>
        </Box>
      </Drawer>

      {/* Drawer do carrinho */}
      <CartDrawer open={cartOpen} onClose={handleCloseCart} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: theme.palette.background.default,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Fade in={true} timeout={800}>
          <Box>{children}</Box>
        </Fade>
      </Box>
    </Box>
  );
}
