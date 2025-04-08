import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  Fade,
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Tab,
  Tabs,
  Stack,
  useTheme,
  Snackbar,
  Alert,
  CircularProgress,
  Tooltip,
  TablePagination,
  Switch,
  Divider,
} from "@mui/material";
import {
  Search,
  MoreVert,
  PersonAdd,
  FilterList,
  Edit,
  Delete,
  Key,
  Block,
  Check,
  Refresh,
  SortByAlpha,
  CloudDownload,
  Print,
  ViewModule,
  ViewList,
  Mail,
  Phone,
} from "@mui/icons-material";
import { motion } from "framer-motion";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  lastActive: string;
  avatarColor?: string;
  phone?: string;
  dateCreated?: string;
  loginCount?: number;
}

const mockUsers: User[] = [
  {
    id: 1,
    name: "João Silva",
    email: "joao.silva@exemplo.com",
    role: "Administrador",
    status: "active",
    lastActive: "Há 5 minutos",
    avatarColor: "#3a7bd5",
    phone: "(11) 98765-4321",
    dateCreated: "10/03/2023",
    loginCount: 248,
  },
  {
    id: 2,
    name: "Maria Oliveira",
    email: "maria.oliveira@exemplo.com",
    role: "Editor",
    status: "active",
    lastActive: "Há 1 hora",
    avatarColor: "#6c63ff",
    phone: "(11) 91234-5678",
    dateCreated: "15/05/2023",
    loginCount: 112,
  },
  {
    id: 3,
    name: "Pedro Santos",
    email: "pedro.santos@exemplo.com",
    role: "Visualizador",
    status: "inactive",
    lastActive: "Há 2 dias",
    avatarColor: "#43a047",
    phone: "(21) 99876-5432",
    dateCreated: "22/01/2023",
    loginCount: 54,
  },
  {
    id: 4,
    name: "Ana Costa",
    email: "ana.costa@exemplo.com",
    role: "Editor",
    status: "active",
    lastActive: "Há 30 minutos",
    avatarColor: "#ef5350",
    phone: "(51) 98765-1234",
    dateCreated: "05/08/2023",
    loginCount: 98,
  },
  {
    id: 5,
    name: "Carlos Mendes",
    email: "carlos.mendes@exemplo.com",
    role: "Visualizador",
    status: "pending",
    lastActive: "Há 5 dias",
    avatarColor: "#ff9800",
    phone: "(47) 99988-7766",
    dateCreated: "17/11/2023",
    loginCount: 23,
  },
  {
    id: 6,
    name: "Juliana Alves",
    email: "juliana.alves@exemplo.com",
    role: "Administrador",
    status: "active",
    lastActive: "Agora",
    avatarColor: "#9c27b0",
    phone: "(85) 98877-6655",
    dateCreated: "30/07/2023",
    loginCount: 176,
  },
  {
    id: 7,
    name: "Roberto Freitas",
    email: "roberto.freitas@exemplo.com",
    role: "Editor",
    status: "inactive",
    lastActive: "Há 1 semana",
    avatarColor: "#795548",
    phone: "(31) 97766-5544",
    dateCreated: "11/04/2023",
    loginCount: 67,
  },
  {
    id: 8,
    name: "Mariana Souza",
    email: "mariana.souza@exemplo.com",
    role: "Visualizador",
    status: "active",
    lastActive: "Há 3 horas",
    avatarColor: "#00acc1",
    phone: "(41) 96655-4433",
    dateCreated: "24/09/2023",
    loginCount: 82,
  },
  {
    id: 9,
    name: "Gustavo Lima",
    email: "gustavo.lima@exemplo.com",
    role: "Editor",
    status: "active",
    lastActive: "Há 2 horas",
    avatarColor: "#5c6bc0",
    phone: "(19) 92233-4455",
    dateCreated: "08/10/2023",
    loginCount: 45,
  },
  {
    id: 10,
    name: "Fernanda Dias",
    email: "fernanda.dias@exemplo.com",
    role: "Visualizador",
    status: "pending",
    lastActive: "Há 4 dias",
    avatarColor: "#26a69a",
    phone: "(62) 98888-9999",
    dateCreated: "13/12/2023",
    loginCount: 19,
  },
  {
    id: 11,
    name: "Lucas Ferreira",
    email: "lucas.ferreira@exemplo.com",
    role: "Administrador",
    status: "active",
    lastActive: "Há 1 dia",
    avatarColor: "#7e57c2",
    phone: "(27) 97777-8888",
    dateCreated: "26/02/2023",
    loginCount: 203,
  },
  {
    id: 12,
    name: "Camila Rocha",
    email: "camila.rocha@exemplo.com",
    role: "Editor",
    status: "inactive",
    lastActive: "Há 3 semanas",
    avatarColor: "#ec407a",
    phone: "(11) 96666-7777",
    dateCreated: "19/06/2023",
    loginCount: 37,
  },
];

const roleOptions = ["Todos", "Administrador", "Editor", "Visualizador"];
const statusOptions = ["Todos", "Ativo", "Inativo", "Pendente"];

const Users = () => {
  const theme = useTheme();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Estados para menus e diálogos
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuUserId, setMenuUserId] = useState<number | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<
    "delete" | "resetPassword" | "edit" | "add"
  >("delete");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Estados para filtros
  const [roleFilter, setRoleFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [showFilters, setShowFilters] = useState(false);

  // Estado para feedback
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  // Estados para paginação
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // Simulando carregamento na mudança de filtros
  useEffect(() => {
    if (roleFilter !== "Todos" || statusFilter !== "Todos") {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [roleFilter, statusFilter]);

  const handleOpenMenu = (
    event: React.MouseEvent<HTMLElement>,
    userId: number
  ) => {
    setMenuUserId(userId);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);

    // Filtrar por status com base na tab
    if (newValue === 0) {
      setStatusFilter("Todos");
    } else if (newValue === 1) {
      setStatusFilter("Ativo");
    } else if (newValue === 2) {
      setStatusFilter("Pendente");
    } else if (newValue === 3) {
      setStatusFilter("Inativo");
    }
  };

  const handleOpenDialog = (
    type: "delete" | "resetPassword" | "edit" | "add",
    user?: User
  ) => {
    setDialogType(type);
    setSelectedUser(user || null);
    setOpenDialog(true);
    handleCloseMenu();
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleAction = () => {
    if (!selectedUser) return;

    // Simular a ação baseada no tipo de diálogo
    switch (dialogType) {
      case "delete":
        setUsers(users.filter((user) => user.id !== selectedUser.id));
        showFeedback(
          `Usuário ${selectedUser.name} removido com sucesso`,
          "success"
        );
        break;
      case "resetPassword":
        showFeedback(
          `Senha do usuário ${selectedUser.name} redefinida com sucesso`,
          "success"
        );
        break;
      case "edit":
        showFeedback(
          `Usuário ${selectedUser.name} atualizado com sucesso`,
          "success"
        );
        break;
      case "add":
        showFeedback("Novo usuário adicionado com sucesso", "success");
        break;
    }

    setOpenDialog(false);
  };

  const showFeedback = (
    message: string,
    severity: "success" | "error" | "info" | "warning"
  ) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setShowSnackbar(true);
  };

  const handleToggleUserStatus = (userId: number) => {
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          const newStatus = user.status === "active" ? "inactive" : "active";
          showFeedback(
            `Status do usuário alterado para ${
              newStatus === "active" ? "Ativo" : "Inativo"
            }`,
            "info"
          );
          return {
            ...user,
            status: newStatus as "active" | "inactive" | "pending",
          };
        }
        return user;
      })
    );
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Aplicar filtros
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "Todos" || user.role === roleFilter;

    const matchesStatus =
      statusFilter === "Todos" ||
      (statusFilter === "Ativo" && user.status === "active") ||
      (statusFilter === "Inativo" && user.status === "inactive") ||
      (statusFilter === "Pendente" && user.status === "pending");

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Paginação
  const paginatedUsers =
    viewMode === "list"
      ? filteredUsers.slice(
          page * rowsPerPage,
          page * rowsPerPage + rowsPerPage
        )
      : filteredUsers;

  const renderUserDialog = () => {
    const dialogTitle = {
      delete: "Remover Usuário",
      resetPassword: "Redefinir Senha",
      edit: "Editar Usuário",
      add: "Adicionar Novo Usuário",
    }[dialogType];

    const dialogContent = {
      delete: (
        <DialogContentText>
          Tem certeza que deseja remover permanentemente o usuário{" "}
          <strong>{selectedUser?.name}</strong>? Esta ação não pode ser
          desfeita.
        </DialogContentText>
      ),
      resetPassword: (
        <DialogContentText>
          Você está prestes a redefinir a senha do usuário{" "}
          <strong>{selectedUser?.name}</strong>. Uma nova senha será gerada e
          enviada para o e-mail do usuário.
        </DialogContentText>
      ),
      edit: (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoFocus
              margin="dense"
              label="Nome"
              fullWidth
              defaultValue={selectedUser?.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              defaultValue={selectedUser?.email}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              label="Telefone"
              fullWidth
              defaultValue={selectedUser?.phone}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Função</InputLabel>
              <Select defaultValue={selectedUser?.role}>
                <MenuItem value="Administrador">Administrador</MenuItem>
                <MenuItem value="Editor">Editor</MenuItem>
                <MenuItem value="Visualizador">Visualizador</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Status</InputLabel>
              <Select defaultValue={selectedUser?.status}>
                <MenuItem value="active">Ativo</MenuItem>
                <MenuItem value="inactive">Inativo</MenuItem>
                <MenuItem value="pending">Pendente</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      ),
      add: (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoFocus
              margin="dense"
              label="Nome"
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField margin="dense" label="Telefone" fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin="dense" required>
              <InputLabel>Função</InputLabel>
              <Select defaultValue="Visualizador">
                <MenuItem value="Administrador">Administrador</MenuItem>
                <MenuItem value="Editor">Editor</MenuItem>
                <MenuItem value="Visualizador">Visualizador</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin="dense">
              <InputLabel>Status</InputLabel>
              <Select defaultValue="active">
                <MenuItem value="active">Ativo</MenuItem>
                <MenuItem value="inactive">Inativo</MenuItem>
                <MenuItem value="pending">Pendente</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      ),
    }[dialogType];

    const actionButton = {
      delete: "Remover",
      resetPassword: "Redefinir",
      edit: "Salvar",
      add: "Adicionar",
    }[dialogType];

    return (
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth={["edit", "add"].includes(dialogType)}
      >
        <DialogTitle>{dialogTitle}</DialogTitle>
        <DialogContent>{dialogContent}</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleAction}
            color="primary"
            variant="contained"
            startIcon={
              dialogType === "delete" ? (
                <Delete />
              ) : dialogType === "resetPassword" ? (
                <Key />
              ) : (
                <Check />
              )
            }
          >
            {actionButton}
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  const renderUserTable = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Usuário</TableCell>
            <TableCell>Função</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Última Atividade</TableCell>
            <TableCell align="center">Ativo</TableCell>
            <TableCell align="right">Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                <CircularProgress size={30} />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Carregando usuários...
                </Typography>
              </TableCell>
            </TableRow>
          ) : paginatedUsers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                <Typography variant="body1">
                  Nenhum usuário encontrado.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            paginatedUsers.map((user) => (
              <TableRow
                key={user.id}
                hover
                component={motion.tr}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar
                      sx={{
                        mr: 2,
                        bgcolor: user.avatarColor || "primary.main",
                        width: 40,
                        height: 40,
                      }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {user.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Chip
                    label={
                      user.status === "active"
                        ? "Ativo"
                        : user.status === "pending"
                        ? "Pendente"
                        : "Inativo"
                    }
                    size="small"
                    sx={{
                      bgcolor:
                        user.status === "active"
                          ? "rgba(0, 200, 83, 0.1)"
                          : user.status === "pending"
                          ? "rgba(255, 193, 7, 0.1)"
                          : "rgba(0, 0, 0, 0.1)",
                      color:
                        user.status === "active"
                          ? "success.main"
                          : user.status === "pending"
                          ? "warning.main"
                          : "text.secondary",
                      fontWeight: 600,
                      borderRadius: 1,
                    }}
                  />
                </TableCell>
                <TableCell>{user.lastActive}</TableCell>
                <TableCell align="center">
                  <Switch
                    checked={user.status === "active"}
                    onChange={() => handleToggleUserStatus(user.id)}
                    color="primary"
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <Tooltip title="Opções">
                    <IconButton
                      size="small"
                      onClick={(e) => handleOpenMenu(e, user.id)}
                    >
                      <MoreVert />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredUsers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage="Linhas por página:"
        labelDisplayedRows={({ from, to, count }) =>
          `${from}-${to} de ${count}`
        }
      />
    </TableContainer>
  );

  const renderUserGrid = () => (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      {isLoading ? (
        <Grid item xs={12} sx={{ textAlign: "center", py: 4 }}>
          <CircularProgress size={40} />
          <Typography variant="body1" sx={{ mt: 2 }}>
            Carregando usuários...
          </Typography>
        </Grid>
      ) : filteredUsers.length === 0 ? (
        <Grid item xs={12} sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="body1">Nenhum usuário encontrado.</Typography>
        </Grid>
      ) : (
        filteredUsers.map((user) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 12px 20px rgba(0,0,0,0.1)",
                  },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 2,
                  }}
                >
                  <Avatar
                    sx={{
                      width: 50,
                      height: 50,
                      bgcolor: user.avatarColor || "primary.main",
                      fontSize: "1.2rem",
                    }}
                  >
                    {user.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Chip
                    label={
                      user.status === "active"
                        ? "Ativo"
                        : user.status === "pending"
                        ? "Pendente"
                        : "Inativo"
                    }
                    size="small"
                    sx={{
                      bgcolor:
                        user.status === "active"
                          ? "rgba(0, 200, 83, 0.1)"
                          : user.status === "pending"
                          ? "rgba(255, 193, 7, 0.1)"
                          : "rgba(0, 0, 0, 0.1)",
                      color:
                        user.status === "active"
                          ? "success.main"
                          : user.status === "pending"
                          ? "warning.main"
                          : "text.secondary",
                      fontWeight: 600,
                      borderRadius: 1,
                    }}
                  />
                </Box>

                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, mb: 0.5 }}
                >
                  {user.name}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {user.role}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Mail fontSize="small" color="action" sx={{ mr: 1 }} />
                  <Typography variant="body2" noWrap>
                    {user.email}
                  </Typography>
                </Box>

                {user.phone && (
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Phone fontSize="small" color="action" sx={{ mr: 1 }} />
                    <Typography variant="body2">{user.phone}</Typography>
                  </Box>
                )}

                <Box
                  sx={{
                    mt: "auto",
                    pt: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="caption" color="text.secondary">
                    Último acesso: {user.lastActive}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => handleOpenMenu(e, user.id)}
                  >
                    <MoreVert fontSize="small" />
                  </IconButton>
                </Box>
              </Paper>
            </motion.div>
          </Grid>
        ))
      )}
    </Grid>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Fade in={true} timeout={800}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 700, color: "text.primary" }}
          >
            Usuários
          </Typography>
        </Fade>
        <Button
          variant="contained"
          startIcon={<PersonAdd />}
          sx={{ borderRadius: 2 }}
          onClick={() => handleOpenDialog("add")}
        >
          Adicionar Usuário
        </Button>
      </Box>

      <Fade in={true} timeout={1000}>
        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            mb: 3,
            boxShadow: "0 2px 10px 0 rgba(58, 123, 213, 0.1)",
          }}
        >
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="Todos" />
            <Tab label="Ativos" />
            <Tab label="Pendentes" />
            <Tab label="Inativos" />
          </Tabs>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <TextField
                placeholder="Buscar usuários..."
                variant="outlined"
                size="small"
                sx={{ width: { xs: "100%", sm: 300 } }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                variant="outlined"
                startIcon={<FilterList />}
                size="medium"
                sx={{ borderRadius: 2 }}
                onClick={() => setShowFilters(!showFilters)}
              >
                Filtros {showFilters ? "▼" : "▲"}
              </Button>
            </Box>

            <Stack direction="row" spacing={1}>
              <Tooltip title="Baixar CSV">
                <IconButton
                  size="small"
                  color="primary"
                  sx={{ border: 1, borderColor: "divider", borderRadius: 1 }}
                >
                  <CloudDownload fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Imprimir">
                <IconButton
                  size="small"
                  color="primary"
                  sx={{ border: 1, borderColor: "divider", borderRadius: 1 }}
                >
                  <Print fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Atualizar">
                <IconButton
                  size="small"
                  color="primary"
                  sx={{ border: 1, borderColor: "divider", borderRadius: 1 }}
                >
                  <Refresh fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={
                  viewMode === "list"
                    ? "Visualização em grade"
                    : "Visualização em lista"
                }
              >
                <IconButton
                  size="small"
                  color="primary"
                  sx={{ border: 1, borderColor: "divider", borderRadius: 1 }}
                  onClick={() =>
                    setViewMode(viewMode === "list" ? "grid" : "list")
                  }
                >
                  {viewMode === "list" ? (
                    <ViewModule fontSize="small" />
                  ) : (
                    <ViewList fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
            </Stack>
          </Box>

          {showFilters && (
            <Box
              sx={{
                mb: 3,
                p: 2,
                bgcolor: "background.default",
                borderRadius: 2,
                animation: "fadeIn 0.3s",
              }}
            >
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                Filtros Avançados
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Função</InputLabel>
                    <Select
                      value={roleFilter}
                      onChange={(e) => setRoleFilter(e.target.value)}
                      label="Função"
                    >
                      {roleOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      label="Status"
                    >
                      {statusOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="outlined"
                    color="inherit"
                    fullWidth
                    onClick={() => {
                      setRoleFilter("Todos");
                      setStatusFilter("Todos");
                      setSearchTerm("");
                    }}
                  >
                    Limpar Filtros
                  </Button>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    startIcon={<SortByAlpha />}
                  >
                    Ordenar
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}

          {viewMode === "list" ? renderUserTable() : renderUserGrid()}

          {/* Menu de contexto para ações do usuário */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
                mt: 1.5,
                width: 200,
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem
              onClick={() => {
                const user = users.find((user) => user.id === menuUserId);
                if (user) handleOpenDialog("edit", user);
              }}
            >
              <ListItemIcon>
                <Edit fontSize="small" />
              </ListItemIcon>
              Editar
            </MenuItem>
            <MenuItem
              onClick={() => {
                const user = users.find((user) => user.id === menuUserId);
                if (user) handleOpenDialog("resetPassword", user);
              }}
            >
              <ListItemIcon>
                <Key fontSize="small" />
              </ListItemIcon>
              Redefinir Senha
            </MenuItem>
            <MenuItem
              onClick={() => {
                const user = users.find((user) => user.id === menuUserId);
                if (user) {
                  handleToggleUserStatus(user.id);
                  handleCloseMenu();
                }
              }}
            >
              <ListItemIcon>
                {users.find((user) => user.id === menuUserId)?.status ===
                "active" ? (
                  <Block fontSize="small" />
                ) : (
                  <Check fontSize="small" />
                )}
              </ListItemIcon>
              {users.find((user) => user.id === menuUserId)?.status === "active"
                ? "Desativar"
                : "Ativar"}
            </MenuItem>
            <Divider />
            <MenuItem
              onClick={() => {
                const user = users.find((user) => user.id === menuUserId);
                if (user) handleOpenDialog("delete", user);
              }}
              sx={{ color: "error.main" }}
            >
              <ListItemIcon sx={{ color: "error.main" }}>
                <Delete fontSize="small" />
              </ListItemIcon>
              Remover
            </MenuItem>
          </Menu>

          {renderUserDialog()}

          {/* Snackbar de feedback */}
          <Snackbar
            open={showSnackbar}
            autoHideDuration={4000}
            onClose={() => setShowSnackbar(false)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Alert
              onClose={() => setShowSnackbar(false)}
              severity={snackbarSeverity}
              sx={{ width: "100%" }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Paper>
      </Fade>
    </Box>
  );
};

export default Users;
