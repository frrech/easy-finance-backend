import { Router } from "express";
import { authenticateToken } from "../middlewares/authMiddleware.js";
import * as CategoriaController from "../controllers/CategoriaController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categorias
 *   description: CRUD operations for income/expense categories (user-owned)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Categoria:
 *       type: object
 *       required:
 *         - nome
 *         - tipo
 *       properties:
 *         idCategoria:
 *           type: integer
 *           description: Primary key of the category
 *         nome:
 *           type: string
 *           description: Category name (e.g. 'Alimentação', 'Salário')
 *         tipo:
 *           type: string
 *           enum: [entrada, saida]
 *           description: "entrada = income, saida = expense"
 *         usuarioId:
 *           type: integer
 *           description: ID of the user who owns this category
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       example:
 *         idCategoria: 1
 *         nome: Alimentação
 *         tipo: saida
 *         usuarioId: 3
 *         createdAt: "2025-02-20T15:01:23.000Z"
 *         updatedAt: "2025-02-20T15:01:23.000Z"
 */

// 🔐 All category routes require authentication
router.use(authenticateToken);

/**
 * @swagger
 * /api/category:
 *   post:
 *     summary: Create a new category for the authenticated user
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - tipo
 *             properties:
 *               nome:
 *                 type: string
 *               tipo:
 *                 type: string
 *                 enum: [entrada, saida]
 *     responses:
 *       201:
 *         description: Category created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 */
router.post("/", CategoriaController.createCategoria);

/**
 * @swagger
 * /api/category:
 *   get:
 *     summary: List all categories belonging to the authenticated user
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Categoria'
 *       401:
 *         description: Unauthorized
 */
router.get("/", CategoriaController.listCategorias);

/**
 * @swagger
 * /api/category/{id}:
 *   get:
 *     summary: Get a category by ID (only if it belongs to the authenticated user)
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       404:
 *         description: Category not found or does not belong to the user
 */
router.get("/:id", CategoriaController.listCategoriaById);

/**
 * @swagger
 * /api/category/{id}:
 *   put:
 *     summary: Update a category (only if it belongs to the authenticated user)
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               tipo:
 *                 type: string
 *                 enum: [entrada, saida]
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       404:
 *         description: Category not found or not owned by the user
 */
router.put("/:id", CategoriaController.updateCategoria);

/**
 * @swagger
 * /api/category/{id}:
 *   delete:
 *     summary: Delete a category (only if it belongs to the authenticated user)
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category ID
 *     responses:
 *       204:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found or not owned by the user
 */
router.delete("/:id", CategoriaController.deleteCategoria);

export default router;
