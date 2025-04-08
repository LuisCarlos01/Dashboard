import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../config/database';
import { AppError } from '../middlewares/errorHandler';

interface User {
  id: number;
  name: string;
  email: string;
  type: 'admin' | 'user';
  created_at: string;
}

export const list = async (req: Request, res: Response) => {
  const users = await query<User[]>(`
    SELECT id, name, email, type, created_at
    FROM users
    ORDER BY created_at DESC
  `);

  return res.json(users);
};

export const create = async (req: Request, res: Response) => {
  const { name, email, password, type } = req.body;

  if (!name || !email || !password) {
    throw new AppError(400, 'Nome, email e senha são obrigatórios');
  }

  // Verifica se o email já está em uso
  const existingUsers = await query<User[]>('SELECT id FROM users WHERE email = ?', [email]);
  if (existingUsers.length) {
    throw new AppError(400, 'Este email já está em uso');
  }

  // Hash da senha
  const hashedPassword = await bcrypt.hash(password, 10);

  // Insere o novo usuário
  const result = await query<{ insertId: number }>(
    'INSERT INTO users (name, email, password, type) VALUES (?, ?, ?, ?)',
    [name, email, hashedPassword, type || 'user']
  );

  const newUser = await query<User[]>(
    'SELECT id, name, email, type, created_at FROM users WHERE id = ?',
    [result.insertId]
  );

  return res.status(201).json(newUser[0]);
};

export const update = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, password, type } = req.body;

  // Verifica se o usuário existe
  const existingUsers = await query<User[]>('SELECT * FROM users WHERE id = ?', [id]);
  if (!existingUsers.length) {
    throw new AppError(404, 'Usuário não encontrado');
  }

  // Verifica se o novo email já está em uso por outro usuário
  if (email) {
    const emailUsers = await query<User[]>(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, id]
    );
    if (emailUsers.length) {
      throw new AppError(400, 'Este email já está em uso');
    }
  }

  // Prepara os campos para atualização
  const updates: any[] = [];
  const values: any[] = [];

  if (name) {
    updates.push('name = ?');
    values.push(name);
  }
  if (email) {
    updates.push('email = ?');
    values.push(email);
  }
  if (password) {
    updates.push('password = ?');
    values.push(await bcrypt.hash(password, 10));
  }
  if (type) {
    updates.push('type = ?');
    values.push(type);
  }

  if (updates.length === 0) {
    throw new AppError(400, 'Nenhum campo para atualizar');
  }

  // Atualiza o usuário
  await query(
    `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
    [...values, id]
  );

  const updatedUser = await query<User[]>(
    'SELECT id, name, email, type, created_at FROM users WHERE id = ?',
    [id]
  );

  return res.json(updatedUser[0]);
};

export const remove = async (req: Request, res: Response) => {
  const { id } = req.params;

  // Verifica se o usuário existe
  const existingUsers = await query<User[]>('SELECT * FROM users WHERE id = ?', [id]);
  if (!existingUsers.length) {
    throw new AppError(404, 'Usuário não encontrado');
  }

  // Verifica se é o último admin
  if (existingUsers[0].type === 'admin') {
    const adminCount = await query<{ count: number }[]>(
      'SELECT COUNT(*) as count FROM users WHERE type = ?',
      ['admin']
    );
    if (adminCount[0].count <= 1) {
      throw new AppError(400, 'Não é possível remover o último administrador');
    }
  }

  await query('DELETE FROM users WHERE id = ?', [id]);

  return res.status(204).send();
}; 