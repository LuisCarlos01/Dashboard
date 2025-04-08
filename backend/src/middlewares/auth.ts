import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./errorHandler";

interface TokenPayload {
  id: number;
  type: "admin" | "user";
}

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError(401, "Token não fornecido");
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "default_secret"
    ) as TokenPayload;

    req.user = decoded;

    return next();
  } catch {
    throw new AppError(401, "Token inválido");
  }
};

export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    throw new AppError(401, "Usuário não autenticado");
  }

  if (req.user.type !== "admin") {
    throw new AppError(403, "Acesso negado");
  }

  return next();
};
