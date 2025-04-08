import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Fade,
  Avatar,
  useTheme,
  Divider,
} from "@mui/material";
import {
  Search,
  FilterList,
  Add,
  ArrowUpward,
  ArrowDownward,
  MoreVert,
  AttachMoney,
  TrendingUp,
  CalendarToday,
  MoreHoriz,
} from "@mui/icons-material";

import D3Chart from "../components/D3Chart";

interface SaleTransaction {
  id: number;
  customer: string;
  customerEmail: string;
  products: string[];
  amount: number;
  date: string;
  status: "completed" | "pending" | "canceled" | "refunded";
  paymentMethod: string;
}

const mockSalesData = [
  { name: "Jan", value: 4000 },
  { name: "Fev", value: 3000 },
  { name: "Mar", value: 2000 },
  { name: "Abr", value: 2780 },
  { name: "Mai", value: 1890 },
  { name: "Jun", value: 2390 },
  { name: "Jul", value: 3490 },
  { name: "Ago", value: 3210 },
  { name: "Set", value: 2860 },
  { name: "Out", value: 3290 },
  { name: "Nov", value: 4120 },
  { name: "Dez", value: 4780 },
];

const mockTransactions: SaleTransaction[] = [
  {
    id: 1,
    customer: "João Silva",
    customerEmail: "joao.silva@exemplo.com",
    products: ["Smartphone X", "Carregador Wireless"],
    amount: 1399.99,
    date: "23/05/2023 14:25",
    status: "completed",
    paymentMethod: "Cartão de Crédito",
  },
  {
    id: 2,
    customer: "Maria Oliveira",
    customerEmail: "maria.oliveira@exemplo.com",
    products: ["Notebook Pro", "Mouse Bluetooth"],
    amount: 4129.99,
    date: "22/05/2023 10:15",
    status: "completed",
    paymentMethod: "Boleto",
  },
  {
    id: 3,
    customer: "Pedro Santos",
    customerEmail: "pedro.santos@exemplo.com",
    products: ["Headphone BT"],
    amount: 299.99,
    date: "21/05/2023 18:40",
    status: "pending",
    paymentMethod: "PIX",
  },
  {
    id: 4,
    customer: "Ana Costa",
    customerEmail: "ana.costa@exemplo.com",
    products: ['Smart TV 55"', "Soundbar"],
    amount: 3598.9,
    date: "20/05/2023 09:33",
    status: "completed",
    paymentMethod: "Cartão de Crédito",
  },
  {
    id: 5,
    customer: "Carlos Mendes",
    customerEmail: "carlos.mendes@exemplo.com",
    products: ["Tablet Air"],
    amount: 899.99,
    date: "19/05/2023 16:20",
    status: "canceled",
    paymentMethod: "PIX",
  },
  {
    id: 6,
    customer: "Juliana Alves",
    customerEmail: "juliana.alves@exemplo.com",
    products: ["Câmera DSLR", "Tripé", "Cartão de Memória"],
    amount: 2199.99,
    date: "18/05/2023 11:05",
    status: "completed",
    paymentMethod: "Cartão de Crédito",
  },
  {
    id: 7,
    customer: "Roberto Freitas",
    customerEmail: "roberto.freitas@exemplo.com",
    products: ["Smartphone X"],
    amount: 1299.99,
    date: "17/05/2023 14:50",
    status: "refunded",
    paymentMethod: "Cartão de Débito",
  },
];

const kpiData = [
  {
    title: "Total de Vendas",
    value: "R$ 13.928,84",
    percent: 12.5,
    trend: "up",
    description: "Este mês",
    icon: <AttachMoney />,
  },
  {
    title: "Transações",
    value: "354",
    percent: 3.2,
    trend: "up",
    description: "Este mês",
    icon: <TrendingUp />,
  },
  {
    title: "Ticket Médio",
    value: "R$ 1.250,42",
    percent: -2.4,
    trend: "down",
    description: "vs mês anterior",
    icon: <CalendarToday />,
  },
];

const Sales = () => {
  const theme = useTheme();
  const [searchTerm, setSearchTerm] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  const filteredTransactions = mockTransactions
    .filter((transaction) => {
      if (tabValue === 0) return true;
      if (tabValue === 1) return transaction.status === "completed";
      if (tabValue === 2) return transaction.status === "pending";
      if (tabValue === 3)
        return (
          transaction.status === "canceled" || transaction.status === "refunded"
        );
      return true;
    })
    .filter(
      (transaction) =>
        transaction.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.customerEmail
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.products.some((product) =>
          product.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
    .sort((a, b) => {
      let comparison = 0;

      if (sortBy === "date") {
        // Convertendo data de string para objeto Date para comparação
        const dateA = a.date.split(" ")[0].split("/").reverse().join("-");
        const dateB = b.date.split(" ")[0].split("/").reverse().join("-");
        comparison = new Date(dateA).getTime() - new Date(dateB).getTime();
      } else if (sortBy === "amount") {
        comparison = a.amount - b.amount;
      } else if (sortBy === "customer") {
        comparison = a.customer.localeCompare(b.customer);
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

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
            Vendas
          </Typography>
        </Fade>
        <Button
          variant="contained"
          startIcon={<Add />}
          sx={{ borderRadius: 2 }}
        >
          Nova Venda
        </Button>
      </Box>

      <Grid container spacing={3}>
        {kpiData.map((kpi, index) => (
          <Grid item xs={12} md={4} key={kpi.title}>
            <Fade in={true} style={{ transitionDelay: `${index * 100}ms` }}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  boxShadow: "0 2px 10px 0 rgba(58, 123, 213, 0.1)",
                  height: "100%",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    mb: 2,
                  }}
                >
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ fontWeight: 600 }}
                  >
                    {kpi.title}
                  </Typography>
                  <Avatar
                    sx={{
                      bgcolor: "rgba(58, 123, 213, 0.1)",
                      color: "primary.main",
                      width: 40,
                      height: 40,
                    }}
                  >
                    {kpi.icon}
                  </Avatar>
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  {kpi.value}
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  {kpi.trend === "up" ? (
                    <ArrowUpward
                      fontSize="small"
                      sx={{ color: "success.main", mr: 0.5 }}
                    />
                  ) : (
                    <ArrowDownward
                      fontSize="small"
                      sx={{ color: "error.main", mr: 0.5 }}
                    />
                  )}
                  <Typography
                    variant="body2"
                    sx={{
                      color: kpi.trend === "up" ? "success.main" : "error.main",
                      fontWeight: 600,
                      mr: 1,
                    }}
                  >
                    {kpi.percent > 0 ? "+" : ""}
                    {kpi.percent}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {kpi.description}
                  </Typography>
                </Box>
              </Paper>
            </Fade>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Fade in={true} timeout={1000}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                boxShadow: "0 2px 10px 0 rgba(58, 123, 213, 0.1)",
                mb: 3,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Relatório de Vendas
              </Typography>
              <Box sx={{ height: 300 }}>
                <D3Chart
                  data={mockSalesData}
                  xKey="name"
                  yKey="value"
                  title="Vendas em 2023"
                  type="area"
                  color={theme.palette.primary.main}
                />
              </Box>
            </Paper>
          </Fade>
        </Grid>

        <Grid item xs={12}>
          <Fade in={true} timeout={1200}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                boxShadow: "0 2px 10px 0 rgba(58, 123, 213, 0.1)",
              }}
            >
              <Box sx={{ p: 3, mb: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Transações
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    sx={{
                      "& .MuiTab-root": {
                        textTransform: "none",
                        fontWeight: 500,
                        color: "text.secondary",
                        "&.Mui-selected": {
                          fontWeight: 600,
                          color: "primary.main",
                        },
                      },
                    }}
                  >
                    <Tab label="Todas" />
                    <Tab label="Concluídas" />
                    <Tab label="Pendentes" />
                    <Tab label="Canceladas" />
                  </Tabs>

                  <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                      placeholder="Buscar transações..."
                      variant="outlined"
                      size="small"
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
                    >
                      Filtros
                    </Button>
                  </Box>
                </Box>
              </Box>

              <Divider />

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleSort("customer")}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          Cliente
                          {sortBy === "customer" &&
                            (sortOrder === "asc" ? (
                              <ArrowUpward fontSize="small" sx={{ ml: 0.5 }} />
                            ) : (
                              <ArrowDownward
                                fontSize="small"
                                sx={{ ml: 0.5 }}
                              />
                            ))}
                        </Box>
                      </TableCell>
                      <TableCell>Produtos</TableCell>
                      <TableCell
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleSort("amount")}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          Valor
                          {sortBy === "amount" &&
                            (sortOrder === "asc" ? (
                              <ArrowUpward fontSize="small" sx={{ ml: 0.5 }} />
                            ) : (
                              <ArrowDownward
                                fontSize="small"
                                sx={{ ml: 0.5 }}
                              />
                            ))}
                        </Box>
                      </TableCell>
                      <TableCell
                        sx={{ cursor: "pointer" }}
                        onClick={() => handleSort("date")}
                      >
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          Data
                          {sortBy === "date" &&
                            (sortOrder === "asc" ? (
                              <ArrowUpward fontSize="small" sx={{ ml: 0.5 }} />
                            ) : (
                              <ArrowDownward
                                fontSize="small"
                                sx={{ ml: 0.5 }}
                              />
                            ))}
                        </Box>
                      </TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Pagamento</TableCell>
                      <TableCell align="right">Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id} hover>
                        <TableCell>
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 600 }}
                            >
                              {transaction.customer}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {transaction.customerEmail}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            {transaction.products.length > 0 && (
                              <Typography variant="body2">
                                {transaction.products[0]}
                              </Typography>
                            )}
                            {transaction.products.length > 1 && (
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ display: "flex", alignItems: "center" }}
                              >
                                <MoreHoriz
                                  fontSize="small"
                                  sx={{ mr: 0.5, fontSize: 14 }}
                                />
                                {transaction.products.length - 1} mais
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {formatCurrency(transaction.amount)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {transaction.date}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={
                              transaction.status === "completed"
                                ? "Concluída"
                                : transaction.status === "pending"
                                ? "Pendente"
                                : transaction.status === "canceled"
                                ? "Cancelada"
                                : "Reembolsada"
                            }
                            size="small"
                            sx={{
                              bgcolor:
                                transaction.status === "completed"
                                  ? "rgba(0, 200, 83, 0.1)"
                                  : transaction.status === "pending"
                                  ? "rgba(255, 193, 7, 0.1)"
                                  : "rgba(244, 67, 54, 0.1)",
                              color:
                                transaction.status === "completed"
                                  ? "success.main"
                                  : transaction.status === "pending"
                                  ? "warning.main"
                                  : "error.main",
                              fontWeight: 600,
                              borderRadius: 1,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {transaction.paymentMethod}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton size="small">
                            <MoreVert fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {filteredTransactions.length === 0 && (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="h6" color="text.secondary">
                    Nenhuma transação encontrada
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tente alterar os filtros ou o termo de busca
                  </Typography>
                </Box>
              )}
            </Paper>
          </Fade>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Sales;
