import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { query } from "../config/database";
import { AppError } from "../middlewares/errorHandler";

interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  type: string;
  avatar?: string;
  oauth_provider?: string;
  oauth_id?: string;
}

// Login do usuário
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validação de campos obrigatórios
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "E-mail e senha são obrigatórios",
      });
    }

    // Busca usuário no banco de dados
    const user = await query<User[]>("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    // Verifica se o usuário existe
    if (user.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Credenciais inválidas",
      });
    }

    // Compara a senha
    const passwordMatch = await bcrypt.compare(password, user[0].password);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Credenciais inválidas",
      });
    }

    // Gera o token JWT
    const token = jwt.sign(
      { id: user[0].id, type: user[0].type },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "24h" }
    );

    // Retorna os dados do usuário e o token
    return res.status(200).json({
      success: true,
      user: {
        id: user[0].id,
        name: user[0].name,
        email: user[0].email,
        type: user[0].type,
        avatar: user[0].avatar || null,
      },
      token,
    });
  } catch (error) {
    console.error("Erro no login:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};

// Registro de novo usuário
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Validação de campos obrigatórios
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Nome, e-mail e senha são obrigatórios",
      });
    }

    // Verifica se o e-mail já está em uso
    const existingUser = await query<User[]>(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Este e-mail já está em uso",
      });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o novo usuário
    const result = await query(
      "INSERT INTO users (name, email, password, type) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, "user"]
    );

    // Gera o token JWT
    const token = jwt.sign(
      { id: result.insertId, type: "user" },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "24h" }
    );

    // Retorna os dados do usuário e o token
    return res.status(201).json({
      success: true,
      user: {
        id: result.insertId,
        name,
        email,
        type: "user",
        avatar: null,
      },
      token,
    });
  } catch (error) {
    console.error("Erro no registro:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};

// Login ou registro via provedores OAuth (Google, Facebook, GitHub)
export const oauthLogin = async (req: Request, res: Response) => {
  try {
    const { provider, token, profile } = req.body;

    if (!provider || !token || !profile) {
      return res.status(400).json({
        success: false,
        message: "Provedor, token e perfil são obrigatórios",
      });
    }

    const { id: oauthId, email, name, picture } = profile;

    // Busca usuário por OAuth ID
    let user = await query<User[]>(
      "SELECT * FROM users WHERE oauth_provider = ? AND oauth_id = ?",
      [provider, oauthId]
    );

    // Se não encontrar pelo OAuth ID, busca pelo email
    if (user.length === 0 && email) {
      user = await query<User[]>("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
    }

    let userId: number;
    let userType: string = "user";
    let userName: string = name;
    let userEmail: string =
      email || `${provider.toLowerCase()}_${oauthId}@example.com`;
    let userAvatar: string = picture || null;

    // Se o usuário não existir, cria um novo
    if (user.length === 0) {
      // Senha aleatória para usuários OAuth (não será usada para login)
      const randomPassword = await bcrypt.hash(uuidv4(), 10);

      const result = await query(
        "INSERT INTO users (name, email, password, type, avatar, oauth_provider, oauth_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          userName,
          userEmail,
          randomPassword,
          userType,
          userAvatar,
          provider,
          oauthId,
        ]
      );

      userId = result.insertId;
    } else {
      // Atualiza informações do usuário existente se necessário
      userId = user[0].id;
      userType = user[0].type;
      userName = user[0].name;

      // Atualiza os dados OAuth se o usuário já existia mas não tinha OAuth vinculado
      if (!user[0].oauth_provider || !user[0].oauth_id) {
        await query(
          "UPDATE users SET oauth_provider = ?, oauth_id = ?, avatar = ? WHERE id = ?",
          [provider, oauthId, userAvatar, userId]
        );
      }
    }

    // Gera o token JWT
    const jwtToken = jwt.sign(
      { id: userId, type: userType },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "24h" }
    );

    // Retorna os dados do usuário e o token
    return res.status(200).json({
      success: true,
      user: {
        id: userId,
        name: userName,
        email: userEmail,
        type: userType,
        avatar: userAvatar,
      },
      token: jwtToken,
    });
  } catch (error) {
    console.error("Erro no login/registro OAuth:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};

// Obter perfil do usuário atual
export const getProfile = async (req: Request, res: Response) => {
  try {
    // O middleware de autenticação já validou o token e adicionou o ID do usuário ao request
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Não autorizado",
      });
    }

    // Busca dados do usuário
    const user = await query<User[]>(
      "SELECT id, name, email, type, avatar FROM users WHERE id = ?",
      [userId]
    );

    if (user.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuário não encontrado",
      });
    }

    // Retorna os dados do usuário
    return res.status(200).json({
      success: true,
      user: user[0],
    });
  } catch (error) {
    console.error("Erro ao obter perfil:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
};
