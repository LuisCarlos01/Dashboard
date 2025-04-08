import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes";
import { AppError } from "./middlewares/errorHandler";
import { connectToDatabase } from "./config/database";

// Carregar variáveis de ambiente
dotenv.config();

// Inicializar o app Express
const app = express();
const PORT = process.env.PORT || 5000;

// Configurar middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Rota de saúde para verificar se o servidor está rodando
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "ok", message: "API está funcionando!" });
});

// Configurar rotas da API
app.use("/api", router);

// Middleware de tratamento de erros
app.use(
  (err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    if (err instanceof AppError) {
      return res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
);

// Rota para lidar com rotas inexistentes
app.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Rota não encontrada",
  });
});

// Função para iniciar o servidor
const startServer = async () => {
  try {
    // Conectar ao banco de dados
    await connectToDatabase();
    console.log("Conexão com o banco de dados estabelecida");

    // Iniciar o servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar o servidor:", error);
    process.exit(1);
  }
};

// Iniciar o servidor
startServer();
