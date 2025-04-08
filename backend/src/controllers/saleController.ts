import { Request, Response } from "express";
import { query } from "../config/database";
import { AppError } from "../middlewares/errorHandler";

interface Sale {
  id: number;
  product_id: number;
  user_id: number;
  value: number;
  date: string;
  product_name?: string;
  user_name?: string;
}

export const list = async (req: Request, res: Response) => {
  const { start_date, end_date } = req.query;

  let sql = `
    SELECT 
      s.id,
      s.product_id,
      s.user_id,
      s.value,
      s.date,
      p.name as product_name,
      u.name as user_name
    FROM sales s
    JOIN products p ON p.id = s.product_id
    JOIN users u ON u.id = s.user_id
  `;

  const params: any[] = [];

  if (start_date || end_date) {
    const conditions: string[] = [];

    if (start_date) {
      conditions.push("s.date >= ?");
      params.push(start_date);
    }

    if (end_date) {
      conditions.push("s.date <= ?");
      params.push(end_date);
    }

    if (conditions.length) {
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }
  }

  sql += " ORDER BY s.date DESC";

  const sales = await query<Sale[]>(sql, params);

  return res.json(sales);
};

export const create = async (req: Request, res: Response) => {
  const { product_id, user_id, value } = req.body;

  if (!product_id || !user_id || value === undefined) {
    throw new AppError(
      400,
      "ID do produto, ID do usuário e valor são obrigatórios"
    );
  }

  if (value <= 0) {
    throw new AppError(400, "O valor da venda deve ser maior que zero");
  }

  // Verifica se o produto existe e tem estoque
  const products = await query<{ id: number; stock: number }[]>(
    "SELECT id, stock FROM products WHERE id = ?",
    [product_id]
  );

  if (!products.length) {
    throw new AppError(404, "Produto não encontrado");
  }

  if (products[0].stock <= 0) {
    throw new AppError(400, "Produto sem estoque disponível");
  }

  // Verifica se o usuário existe
  const users = await query<{ id: number }[]>(
    "SELECT id FROM users WHERE id = ?",
    [user_id]
  );

  if (!users.length) {
    throw new AppError(404, "Usuário não encontrado");
  }

  // Inicia a transação
  await query("START TRANSACTION");

  try {
    // Registra a venda
    const result = await query<{ insertId: number }>(
      "INSERT INTO sales (product_id, user_id, value) VALUES (?, ?, ?)",
      [product_id, user_id, value]
    );

    // Atualiza o estoque
    await query("UPDATE products SET stock = stock - 1 WHERE id = ?", [
      product_id,
    ]);

    // Confirma a transação
    await query("COMMIT");

    // Retorna a venda criada
    const newSale = await query<Sale[]>(
      `
      SELECT 
        s.id,
        s.product_id,
        s.user_id,
        s.value,
        s.date,
        p.name as product_name,
        u.name as user_name
      FROM sales s
      JOIN products p ON p.id = s.product_id
      JOIN users u ON u.id = s.user_id
      WHERE s.id = ?
    `,
      [result.insertId]
    );

    return res.status(201).json(newSale[0]);
  } catch (error) {
    // Em caso de erro, reverte a transação
    await query("ROLLBACK");
    throw error;
  }
};
