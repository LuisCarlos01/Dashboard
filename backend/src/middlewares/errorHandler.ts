import { Request, Response, NextFunction } from "express";

// Classe personalizada para erros da aplicação
export class AppError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }
}

// Middleware para tratamento de erros da aplicação
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Erro capturado pelo middleware:", err);

  // Verifica se é um erro da aplicação
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  // Erros de validação do Express Validator
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Erro de validação",
      errors: err.message,
    });
  }

  // Erros do JWT
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Token inválido",
    });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Token expirado",
    });
  }

  // Erros de conexão com o banco de dados
  if (
    err.name === "SequelizeConnectionError" ||
    err.name === "SequelizeDatabaseError"
  ) {
    return res.status(503).json({
      success: false,
      message: "Erro de conexão com o banco de dados",
    });
  }

  // Erros desconhecidos
  return res.status(500).json({
    success: false,
    message: "Erro interno do servidor",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
};
