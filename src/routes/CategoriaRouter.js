import * as CategoriaController from "../controllers/CategoriaController.js";
import { Router } from "express";
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Categorias
 *   description: Manage income and expense categories
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
 *         id_categoria:
 *           type: integer
 *         nome:
 *           type: string
 *         tipo:
 *           type: string
 *           enum: [entrada, saida]
 *           description: "entrada = income, saida = expense"
 *         usuario_id:
 *           type: integer
 *           description: ID of the user that owns this category
 *       example:
 *         id_categoria: 1
 *         nome: Alimentação
 *         tipo: saida
 *         usuario_id: 2
 */

/**
 * @swagger
 * /api/category:
 *   post:
 *     summary: Create a new category
 *     tags: [Categorias]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Categoria'
 *     responses:
 *       201:
 *         description: Category created successfully
 */
router.post("/", CategoriaController.createCategoria);

/**
 * @swagger
 * /api/category/{id}:
 *   get:
 *     summary: Get a category by ID
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Categoria'
 *       404:
 *         description: Category not found
 */
router.get("/:id", CategoriaController.listCategoriaById);

/**
 * @swagger
 * /api/category/usuario/{usuario_id}:
 *   get:
 *     summary: List all categories for a specific user
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of user categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Categoria'
 */
router.get("/usuario/:usuario_id", CategoriaController.listCategoriasByUsuario);

/**
 * @swagger
 * /api/category/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Categoria'
 *     responses:
 *       200:
 *         description: Category updated successfully
 */
router.put("/:id", CategoriaController.updateCategoria);

/**
 * @swagger
 * /api/category/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categorias]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Category deleted successfully
 */
router.delete("/:id", CategoriaController.deleteCategoria);

export default router;
