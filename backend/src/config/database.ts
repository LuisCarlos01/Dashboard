import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Carrega as variáveis de ambiente
dotenv.config();

// Configuração da conexão com o banco de dados
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "dashboard",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Pool de conexões para melhor gerenciamento
let pool: mysql.Pool;

/**
 * Inicializa a conexão com o banco de dados
 */
export const connectToDatabase = async (): Promise<void> => {
  try {
    pool = mysql.createPool(dbConfig);

    // Testa a conexão
    const connection = await pool.getConnection();
    connection.release();

    console.log("📊 Conexão com o banco de dados estabelecida");
  } catch (error) {
    console.error("❌ Erro ao conectar com o banco de dados:", error);
    throw error;
  }
};

/**
 * Executa uma query SQL com parâmetros
 * @param sql Query SQL
 * @param params Parâmetros para a query
 * @returns Resultado da query
 */
export const query = async <T>(sql: string, params?: any[]): Promise<T> => {
  try {
    if (!pool) {
      await connectToDatabase();
    }

    const [results] = await pool.execute(sql, params);
    return results as unknown as T;
  } catch (error) {
    console.error("❌ Erro ao executar query:", sql);
    console.error("Parâmetros:", params);
    console.error("Erro:", error);
    throw error;
  }
};

/**
 * Finaliza a conexão com o banco de dados
 */
export const closeDatabase = async (): Promise<void> => {
  if (pool) {
    await pool.end();
    console.log("Conexão com o banco de dados encerrada");
  }
};

/**
 * Script para criar as tabelas necessárias (apenas desenvolvimento)
 */
export const setupDatabase = async (): Promise<void> => {
  try {
    await connectToDatabase();

    // Criação da tabela de usuários
    await query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        type ENUM('admin', 'user') NOT NULL DEFAULT 'user',
        avatar VARCHAR(255),
        oauth_provider VARCHAR(50),
        oauth_id VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Criação da tabela de produtos
    await query(`
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10, 2) NOT NULL,
        category VARCHAR(100) NOT NULL,
        stock INT NOT NULL DEFAULT 0,
        image VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Criação da tabela de vendas
    await query(`
      CREATE TABLE IF NOT EXISTS sales (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        total DECIMAL(10, 2) NOT NULL,
        status ENUM('pending', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
        payment_method VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    // Criação da tabela de itens de venda
    await query(`
      CREATE TABLE IF NOT EXISTS sale_items (
        id INT AUTO_INCREMENT PRIMARY KEY,
        sale_id INT NOT NULL,
        product_id INT,
        quantity INT NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (sale_id) REFERENCES sales(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
      )
    `);

    // Criar um usuário admin padrão se não existir
    const adminEmail = "admin@example.com";
    const [userExists] = await query<any[]>(
      "SELECT * FROM users WHERE email = ?",
      [adminEmail]
    );

    if (!userExists || userExists.length === 0) {
      // Senha: admin123 (já está com hash bcrypt)
      const hashedPassword =
        "$2a$10$3ZXdhVHtHK7FQsLfEP26E.9L3AJhCZKESJ6RmKtyfpVXYqMTwCKQ2";

      await query(
        `
        INSERT INTO users (name, email, password, type)
        VALUES ('Admin', ?, ?, 'admin')
      `,
        [adminEmail, hashedPassword]
      );

      console.log("✅ Usuário admin padrão criado");
    }

    console.log("✅ Banco de dados configurado com sucesso");
  } catch (error) {
    console.error("❌ Erro ao configurar banco de dados:", error);
    throw error;
  }
};
