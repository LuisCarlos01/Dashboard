import express from "express";
import { auth, requireAdmin } from "../middlewares/auth";
import * as authController from "../controllers/authController";
import * as dashboardController from "../controllers/dashboardController";
import * as userController from "../controllers/userController";
import * as productController from "../controllers/productController";
import * as saleController from "../controllers/saleController";

const router = express.Router();

// Rotas públicas (autenticação)
router.post("/auth/login", authController.login);
router.post("/auth/register", authController.register);
router.post("/auth/oauth", authController.oauthLogin);

// Rotas protegidas (requerem autenticação)
// Perfil de usuário
router.get("/profile", auth, authController.getProfile);

// Dashboard
router.get("/dashboard/kpis", auth, dashboardController.getKpis);
router.get("/dashboard/sales", auth, dashboardController.getSales);
router.get("/dashboard/categories", auth, dashboardController.getCategories);
router.get(
  "/dashboard/transactions",
  auth,
  dashboardController.getTransactions
);
router.get("/dashboard/products", auth, dashboardController.getTopProducts);

// Usuários (apenas admin)
router.get("/users", auth, requireAdmin, userController.getUsers);
router.get("/users/:id", auth, requireAdmin, userController.getUser);
router.post("/users", auth, requireAdmin, userController.createUser);
router.put("/users/:id", auth, requireAdmin, userController.updateUser);
router.delete("/users/:id", auth, requireAdmin, userController.deleteUser);

// Produtos
router.get("/products", auth, productController.getProducts);
router.get("/products/:id", auth, productController.getProduct);
router.post("/products", auth, requireAdmin, productController.createProduct);
router.put(
  "/products/:id",
  auth,
  requireAdmin,
  productController.updateProduct
);
router.delete(
  "/products/:id",
  auth,
  requireAdmin,
  productController.deleteProduct
);

// Vendas
router.get("/sales", auth, saleController.getSales);
router.get("/sales/:id", auth, saleController.getSale);
router.post("/sales", auth, saleController.createSale);
router.put("/sales/:id", auth, requireAdmin, saleController.updateSale);
router.delete("/sales/:id", auth, requireAdmin, saleController.deleteSale);

export default router;
