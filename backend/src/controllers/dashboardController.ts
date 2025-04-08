import { Request, Response } from "express";
import { query } from "../config/database";

interface SalesByPeriod {
  label: string;
  value: number;
}

interface SalesByCategory {
  label: string;
  value: number;
}

export const getMetrics = async (req: Request, res: Response) => {
  const { period = "month" } = req.query;

  // Calcula o início do período atual e anterior
  const currentDate = new Date();
  let startDate: Date;
  let previousStartDate: Date;

  switch (period) {
    case "week":
      startDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
      previousStartDate = new Date(startDate);
      previousStartDate.setDate(previousStartDate.getDate() - 7);
      break;
    case "year":
      startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 12));
      previousStartDate = new Date(startDate);
      previousStartDate.setMonth(previousStartDate.getMonth() - 12);
      break;
    default: // month
      startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
      previousStartDate = new Date(startDate);
      previousStartDate.setMonth(previousStartDate.getMonth() - 1);
  }

  // KPIs
  const [
    currentRevenue,
    previousRevenue,
    currentUsers,
    previousUsers,
    currentOrders,
    previousOrders,
  ] = await Promise.all([
    query<{ total: number }[]>(
      "SELECT COALESCE(SUM(value), 0) as total FROM sales WHERE date >= ?",
      [startDate]
    ),
    query<{ total: number }[]>(
      "SELECT COALESCE(SUM(value), 0) as total FROM sales WHERE date >= ? AND date < ?",
      [previousStartDate, startDate]
    ),
    query<{ total: number }[]>(
      "SELECT COUNT(DISTINCT user_id) as total FROM sales WHERE date >= ?",
      [startDate]
    ),
    query<{ total: number }[]>(
      "SELECT COUNT(DISTINCT user_id) as total FROM sales WHERE date >= ? AND date < ?",
      [previousStartDate, startDate]
    ),
    query<{ total: number }[]>(
      "SELECT COUNT(*) as total FROM sales WHERE date >= ?",
      [startDate]
    ),
    query<{ total: number }[]>(
      "SELECT COUNT(*) as total FROM sales WHERE date >= ? AND date < ?",
      [previousStartDate, startDate]
    ),
  ]);

  // Vendas por período
  const salesByPeriod = await query<SalesByPeriod[]>(
    `
    SELECT 
      DATE_FORMAT(date, '%Y-%m-%d') as label,
      SUM(value) as value
    FROM sales 
    WHERE date >= ?
    GROUP BY DATE_FORMAT(date, '%Y-%m-%d')
    ORDER BY date ASC
  `,
    [startDate]
  );

  // Vendas por categoria
  const salesByCategory = await query<SalesByCategory[]>(
    `
    SELECT 
      p.category as label,
      SUM(s.value) as value
    FROM sales s
    JOIN products p ON p.id = s.product_id
    WHERE s.date >= ?
    GROUP BY p.category
  `,
    [startDate]
  );

  // Calcula as tendências
  const calculateTrend = (current: number, previous: number) => {
    if (previous === 0) return { value: 100, isPositive: true };
    const trend = ((current - previous) / previous) * 100;
    return {
      value: Math.abs(Number(trend.toFixed(1))),
      isPositive: trend >= 0,
    };
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  // Calcula o ticket médio
  const currentAvgTicket =
    currentOrders[0].total > 0
      ? currentRevenue[0].total / currentOrders[0].total
      : 0;
  const previousAvgTicket =
    previousOrders[0].total > 0
      ? previousRevenue[0].total / previousOrders[0].total
      : 0;

  return res.json({
    kpis: {
      revenue: {
        value: formatCurrency(currentRevenue[0].total),
        trend: calculateTrend(
          currentRevenue[0].total,
          previousRevenue[0].total
        ),
      },
      users: {
        value: currentUsers[0].total.toString(),
        trend: calculateTrend(currentUsers[0].total, previousUsers[0].total),
      },
      orders: {
        value: currentOrders[0].total.toString(),
        trend: calculateTrend(currentOrders[0].total, previousOrders[0].total),
      },
      avgTicket: {
        value: formatCurrency(currentAvgTicket),
        trend: calculateTrend(currentAvgTicket, previousAvgTicket),
      },
    },
    salesData: salesByPeriod,
    categoryData: salesByCategory,
  });
};
