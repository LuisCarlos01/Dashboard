import { Request, Response } from "express";
import { query } from "../config/database";
import { AppError } from "../middlewares/errorHandler";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  created_at: string;
}

export const list = async (req: Request, res: Response) => {
  const { category } = req.query;

  let sql = `
    SELECT id, name, category, price, stock, created_at
    FROM products
  `;

  const params: any[] = [];

  if (category) {
    sql += " WHERE category = ?";
    params.push(category);
  }

  sql += " ORDER BY created_at DESC";

  const products = await query<Product[]>(sql, params);

  return res.json(products);
};

export const create = async (req: Request, res: Response) => {
  const { name, category, price, stock } = req.body;

  if (!name || !category || price === undefined) {
    throw new AppError(400, "Nome, categoria e preço são obrigatórios");
  }

  if (price < 0) {
    throw new AppError(400, "O preço não pode ser negativo");
  }

  if (stock !== undefined && stock < 0) {
    throw new AppError(400, "O estoque não pode ser negativo");
  }

  // Insere o novo produto
  const result = await query<{ insertId: number }>(
    "INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?)",
    [name, category, price, stock || 0]
  );

  const newProduct = await query<Product[]>(
    "SELECT * FROM products WHERE id = ?",
    [result.insertId]
  );

  return res.status(201).json(newProduct[0]);
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, category, price, stock } = req.body;

  // Verifica se o produto existe
  const existingProducts = await query<Product[]>(
    "SELECT * FROM products WHERE id = ?",
    [id]
  );
  if (!existingProducts.length) {
    throw new AppError(404, "Produto não encontrado");
  }

  // Validações
  if (price !== undefined && price < 0) {
    throw new AppError(400, "O preço não pode ser negativo");
  }

  if (stock !== undefined && stock < 0) {
    throw new AppError(400, "O estoque não pode ser negativo");
  }

  // Prepara os campos para atualização
  const updates: any[] = [];
  const values: any[] = [];

  if (name) {
    updates.push("name = ?");
    values.push(name);
  }
  if (category) {
    updates.push("category = ?");
    values.push(category);
  }
  if (price !== undefined) {
    updates.push("price = ?");
    values.push(price);
  }
  if (stock !== undefined) {
    updates.push("stock = ?");
    values.push(stock);
  }

  if (updates.length === 0) {
    throw new AppError(400, "Nenhum campo para atualizar");
  }

  // Atualiza o produto
  await query(`UPDATE products SET ${updates.join(", ")} WHERE id = ?`, [
    ...values,
    id,
  ]);

  const updatedProduct = await query<Product[]>(
    "SELECT * FROM products WHERE id = ?",
    [id]
  );

  return res.json(updatedProduct[0]);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Verifica se o produto existe
  const existingProducts = await query<Product[]>(
    "SELECT * FROM products WHERE id = ?",
    [id]
  );
  if (!existingProducts.length) {
    throw new AppError(404, "Produto não encontrado");
  }

  // Verifica se o produto tem vendas associadas
  const sales = await query<{ count: number }[]>(
    "SELECT COUNT(*) as count FROM sales WHERE product_id = ?",
    [id]
  );

  if (sales[0].count > 0) {
    throw new AppError(
      400,
      "Não é possível remover um produto com vendas associadas"
    );
  }

  await query("DELETE FROM products WHERE id = ?", [id]);

  return res.status(204).send();
};
