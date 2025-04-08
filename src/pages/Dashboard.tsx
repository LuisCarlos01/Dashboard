import { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  Avatar,
  CircularProgress,
  Button,
  Fade,
  Zoom,
  Divider,
  useTheme,
} from "@mui/material";
import {
  TrendingUp,
  TrendingDown,
  People,
  ShoppingBag,
  AttachMoney,
  MoreVert,
  ShowChart,
  CalendarToday,
} from "@mui/icons-material";

import KPICard from "../components/KPICard";
import D3Chart from "../components/D3Chart";

// Dados de exemplo - Em produção, viriam da API
const mockData = {
  kpis: {
    revenue: {
      value: "R$ 125.430,00",
      trend: { value: 12.5, isPositive: true },
    },
    users: {
      value: "1.234",
      trend: { value: 8.2, isPositive: true },
    },
    orders: {
      value: "856",
      trend: { value: 3.1, isPositive: false },
    },
    avgTicket: {
      value: "R$ 146,50",
      trend: { value: 5.4, isPositive: true },
    },
  },
  salesData: [
    { label: "Jan", value: 65000 },
    { label: "Fev", value: 72000 },
    { label: "Mar", value: 85000 },
    { label: "Abr", value: 78000 },
    { label: "Mai", value: 92000 },
    { label: "Jun", value: 125430 },
  ],
  categoryData: [
    { label: "Eletrônicos", value: 45 },
    { label: "Roupas", value: 25 },
    { label: "Alimentos", value: 15 },
    { label: "Outros", value: 15 },
  ],
};

type Period = "week" | "month" | "year";

// Dados mock específicos para cada período de tempo
const kpiDataByPeriod = {
  week: [
    {
      title: "Vendas Totais",
      value: "R$ 6.470",
      change: 8.3,
      changeType: "increase",
      icon: <AttachMoney />,
      color: "#3a7bd5",
    },
    {
      title: "Novos Clientes",
      value: "156",
      change: 4.1,
      changeType: "increase",
      icon: <People />,
      color: "#6c63ff",
    },
    {
      title: "Produtos Vendidos",
      value: "278",
      change: -1.2,
      changeType: "decrease",
      icon: <ShoppingBag />,
      color: "#00d4b1",
    },
    {
      title: "Taxa de Conversão",
      value: "2.8%",
      change: 0.7,
      changeType: "increase",
      icon: <TrendingUp />,
      color: "#ffc658",
    },
  ],
  month: [
    {
      title: "Vendas Totais",
      value: "R$ 24.780",
      change: 12.5,
      changeType: "increase",
      icon: <AttachMoney />,
      color: "#3a7bd5",
    },
    {
      title: "Novos Clientes",
      value: "854",
      change: 5.2,
      changeType: "increase",
      icon: <People />,
      color: "#6c63ff",
    },
    {
      title: "Produtos Vendidos",
      value: "1.230",
      change: -2.4,
      changeType: "decrease",
      icon: <ShoppingBag />,
      color: "#00d4b1",
    },
    {
      title: "Taxa de Conversão",
      value: "3.2%",
      change: 1.1,
      changeType: "increase",
      icon: <TrendingUp />,
      color: "#ffc658",
    },
  ],
  year: [
    {
      title: "Vendas Totais",
      value: "R$ 297.350",
      change: 15.8,
      changeType: "increase",
      icon: <AttachMoney />,
      color: "#3a7bd5",
    },
    {
      title: "Novos Clientes",
      value: "9.728",
      change: 7.9,
      changeType: "increase",
      icon: <People />,
      color: "#6c63ff",
    },
    {
      title: "Produtos Vendidos",
      value: "15.642",
      change: 6.1,
      changeType: "increase",
      icon: <ShoppingBag />,
      color: "#00d4b1",
    },
    {
      title: "Taxa de Conversão",
      value: "3.7%",
      change: 2.3,
      changeType: "increase",
      icon: <TrendingUp />,
      color: "#ffc658",
    },
  ],
};

// Dados mock de vendas para cada período
const salesDataByPeriod = {
  week: [
    { name: "Dom", value: 1200 },
    { name: "Seg", value: 980 },
    { name: "Ter", value: 1150 },
    { name: "Qua", value: 1320 },
    { name: "Qui", value: 1400 },
    { name: "Sex", value: 1650 },
    { name: "Sáb", value: 1900 },
  ],
  month: [
    { name: "Semana 1", value: 4000 },
    { name: "Semana 2", value: 5230 },
    { name: "Semana 3", value: 6780 },
    { name: "Semana 4", value: 8770 },
  ],
  year: [
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
  ],
};

// Dados mock de produtos mais vendidos para cada período
const topProductsByPeriod = {
  week: [
    { name: "Smartphone X", sales: 87, revenue: "R$ 113.013,00", growth: 12 },
    { name: "Headphone BT", sales: 56, revenue: "R$ 16.744,00", growth: 18 },
    { name: "Notebook Pro", sales: 43, revenue: "R$ 171.957,00", growth: 5 },
    { name: 'Smart TV 55"', sales: 21, revenue: "R$ 58.779,00", growth: -2 },
  ],
  month: [
    { name: "Smartphone X", sales: 532, revenue: "R$ 691.568,00", growth: 15 },
    {
      name: "Notebook Pro",
      sales: 398,
      revenue: "R$ 1.591.602,00",
      growth: 23,
    },
    { name: 'Smart TV 55"', sales: 267, revenue: "R$ 747.333,00", growth: 7 },
    { name: "Headphone BT", sales: 215, revenue: "R$ 64.285,00", growth: -3 },
  ],
  year: [
    {
      name: "Notebook Pro",
      sales: 4521,
      revenue: "R$ 18.078.879,00",
      growth: 25,
    },
    {
      name: "Smartphone X",
      sales: 3879,
      revenue: "R$ 5.042.700,00",
      growth: 17,
    },
    {
      name: 'Smart TV 55"',
      sales: 2856,
      revenue: "R$ 7.997.944,00",
      growth: 12,
    },
    { name: "Headphone BT", sales: 1987, revenue: "R$ 594.113,00", growth: 8 },
  ],
};

// Dados mock de transações recentes para cada período
const recentTransactionsByPeriod = {
  week: [
    {
      id: 1,
      customer: "João Silva",
      product: "Smartphone X",
      amount: "R$ 1.299,00",
      date: "Hoje",
      status: "Concluído",
    },
    {
      id: 2,
      customer: "Maria Oliveira",
      product: "Notebook Pro",
      amount: "R$ 3.999,00",
      date: "Ontem",
      status: "Concluído",
    },
    {
      id: 3,
      customer: "Pedro Santos",
      product: "Headphone BT",
      amount: "R$ 299,00",
      date: "Há 2 dias",
      status: "Pendente",
    },
    {
      id: 4,
      customer: "Ana Costa",
      product: 'Smart TV 55"',
      amount: "R$ 2.799,00",
      date: "Há 3 dias",
      status: "Concluído",
    },
    {
      id: 5,
      customer: "Carlos Mendes",
      product: "Tablet Air",
      amount: "R$ 899,00",
      date: "Há 4 dias",
      status: "Cancelado",
    },
  ],
  month: [
    {
      id: 1,
      customer: "João Silva",
      product: "Smartphone X",
      amount: "R$ 1.299,00",
      date: "23/05/2023",
      status: "Concluído",
    },
    {
      id: 2,
      customer: "Maria Oliveira",
      product: "Notebook Pro",
      amount: "R$ 3.999,00",
      date: "22/05/2023",
      status: "Concluído",
    },
    {
      id: 3,
      customer: "Pedro Santos",
      product: "Headphone BT",
      amount: "R$ 299,00",
      date: "21/05/2023",
      status: "Pendente",
    },
    {
      id: 4,
      customer: "Ana Costa",
      product: 'Smart TV 55"',
      amount: "R$ 2.799,00",
      date: "20/05/2023",
      status: "Concluído",
    },
    {
      id: 5,
      customer: "Carlos Mendes",
      product: "Tablet Air",
      amount: "R$ 899,00",
      date: "19/05/2023",
      status: "Cancelado",
    },
  ],
  year: [
    {
      id: 1,
      customer: "Empresa ABC Ltda",
      product: "Notebooks Pro (10 unidades)",
      amount: "R$ 39.990,00",
      date: "15/05/2023",
      status: "Concluído",
    },
    {
      id: 2,
      customer: "Supermercado XYZ",
      product: "Tablets (15 unidades)",
      amount: "R$ 13.485,00",
      date: "28/04/2023",
      status: "Concluído",
    },
    {
      id: 3,
      customer: "Escola Criativa",
      product: "Smart TVs (5 unidades)",
      amount: "R$ 13.995,00",
      date: "10/04/2023",
      status: "Concluído",
    },
    {
      id: 4,
      customer: "Escritório Arquitetura",
      product: "Computadores Desktop (8 unidades)",
      amount: "R$ 28.792,00",
      date: "22/03/2023",
      status: "Concluído",
    },
    {
      id: 5,
      customer: "Clínica Saúde Total",
      product: "Equipamentos diversos",
      amount: "R$ 22.560,00",
      date: "15/02/2023",
      status: "Concluído",
    },
  ],
};

// Mapeamento de período para rótulo de data
const dateRangeByPeriod = {
  week: "17 Jun - 23 Jun 2023",
  month: "23 Mai - 22 Jun 2023",
  year: "Jun 2022 - Jun 2023",
};

// Mapeamento de período para título do gráfico
const chartTitleByPeriod = {
  week: "Vendas da Semana",
  month: "Vendas do Mês",
  year: "Vendas do Ano",
};

export default function Dashboard() {
  const theme = useTheme();
  const [timeRange, setTimeRange] = useState<Period>("month");
  const [kpiData, setKpiData] = useState(kpiDataByPeriod.month);
  const [salesData, setSalesData] = useState(salesDataByPeriod.month);
  const [topProducts, setTopProducts] = useState(topProductsByPeriod.month);
  const [recentTransactions, setRecentTransactions] = useState(
    recentTransactionsByPeriod.month
  );
  const [dateRange, setDateRange] = useState(dateRangeByPeriod.month);
  const [chartTitle, setChartTitle] = useState(chartTitleByPeriod.month);

  // Atualizar dados com base no período selecionado
  useEffect(() => {
    setKpiData(kpiDataByPeriod[timeRange]);
    setSalesData(salesDataByPeriod[timeRange]);
    setTopProducts(topProductsByPeriod[timeRange]);
    setRecentTransactions(recentTransactionsByPeriod[timeRange]);
    setDateRange(dateRangeByPeriod[timeRange]);
    setChartTitle(chartTitleByPeriod[timeRange]);
  }, [timeRange]);

  const handleTimeRangeChange = (
    event: React.MouseEvent<HTMLElement>,
    newTimeRange: Period | null
  ) => {
    if (newTimeRange !== null) {
      setTimeRange(newTimeRange);
    }
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
            Dashboard
          </Typography>
        </Fade>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<CalendarToday />}
            sx={{ borderRadius: 2 }}
          >
            {dateRange}
          </Button>
          <ToggleButtonGroup
            value={timeRange}
            exclusive
            onChange={handleTimeRangeChange}
            aria-label="Período de tempo"
            size="small"
            sx={{
              "& .MuiToggleButton-root": {
                borderRadius: 2,
                px: 2,
                py: 0.5,
                fontSize: "0.875rem",
                "&.Mui-selected": {
                  backgroundColor: "primary.main",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                    color: "white",
                  },
                },
              },
            }}
          >
            <ToggleButton value="week" aria-label="Semana">
              Semana
            </ToggleButton>
            <ToggleButton value="month" aria-label="Mês">
              Mês
            </ToggleButton>
            <ToggleButton value="year" aria-label="Ano">
              Ano
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {kpiData.map((kpi, index) => (
          <Grid item xs={12} sm={6} md={3} key={kpi.title}>
            <Zoom in={true} style={{ transitionDelay: `${index * 100}ms` }}>
              <Box>
                <KPICard
                  title={kpi.title}
                  value={kpi.value}
                  change={kpi.change}
                  changeType={kpi.changeType as "increase" | "decrease"}
                  icon={kpi.icon}
                  color={kpi.color}
                />
              </Box>
            </Zoom>
          </Grid>
        ))}

        <Grid item xs={12} md={8}>
          <Fade in={true} timeout={1000}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                height: "100%",
                boxShadow: "0 2px 10px 0 rgba(58, 123, 213, 0.1)",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Relatório de Vendas
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Desempenho das vendas ao longo do tempo
                  </Typography>
                </Box>
                <Avatar sx={{ backgroundColor: "rgba(106, 99, 255, 0.1)" }}>
                  <ShowChart sx={{ color: theme.palette.primary.main }} />
                </Avatar>
              </Box>
              <Box sx={{ height: 350 }}>
                <D3Chart
                  data={salesData}
                  xKey="name"
                  yKey="value"
                  title={chartTitle}
                  type="bar"
                />
              </Box>
            </Paper>
          </Fade>
        </Grid>

        <Grid item xs={12} md={4}>
          <Fade in={true} timeout={1200}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                height: "100%",
                boxShadow: "0 2px 10px 0 rgba(58, 123, 213, 0.1)",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Produtos Mais Vendidos
              </Typography>
              <Box sx={{ mb: 2 }}>
                {topProducts.map((product, index) => (
                  <Box key={product.name} sx={{ mb: 2 }}>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {product.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color:
                            product.growth > 0 ? "success.main" : "error.main",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {product.growth > 0 ? (
                          <TrendingUp fontSize="small" sx={{ mr: 0.5 }} />
                        ) : (
                          <TrendingDown fontSize="small" sx={{ mr: 0.5 }} />
                        )}
                        {product.growth > 0 ? "+" : ""}
                        {product.growth}%
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {product.sales} unidades • {product.revenue}
                      </Typography>
                    </Box>
                    {index < topProducts.length - 1 && (
                      <Divider sx={{ my: 2 }} />
                    )}
                  </Box>
                ))}
              </Box>
            </Paper>
          </Fade>
        </Grid>

        <Grid item xs={12}>
          <Fade in={true} timeout={1400}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                boxShadow: "0 2px 10px 0 rgba(58, 123, 213, 0.1)",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                Transações Recentes
              </Typography>
              <Box sx={{ overflowX: "auto" }}>
                <Box sx={{ minWidth: 800 }}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(5, 1fr)",
                      bgcolor: "background.default",
                      p: 2,
                      borderRadius: 2,
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Cliente
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Produto
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Valor
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Data
                    </Typography>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      Status
                    </Typography>
                  </Box>

                  {recentTransactions.map((transaction) => (
                    <Box
                      key={transaction.id}
                      sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(5, 1fr)",
                        p: 2,
                        borderRadius: 2,
                        "&:hover": {
                          bgcolor: "background.default",
                        },
                        transition: "background-color 0.2s",
                      }}
                    >
                      <Typography variant="body2">
                        {transaction.customer}
                      </Typography>
                      <Typography variant="body2">
                        {transaction.product}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {transaction.amount}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {transaction.date}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color:
                            transaction.status === "Concluído"
                              ? "success.main"
                              : transaction.status === "Pendente"
                              ? "warning.main"
                              : "error.main",
                          fontWeight: 500,
                        }}
                      >
                        {transaction.status}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Paper>
          </Fade>
        </Grid>
      </Grid>
    </Box>
  );
}
