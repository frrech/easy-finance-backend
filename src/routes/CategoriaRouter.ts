// src/routes/categoriaRouter.ts
import { Router } from "express";
import authenticateToken from "../middlewares/authenticateToken.js";
import * as CategoriaController from "../controllers/CategoriaController.js";

const router = Router();

router.use(authenticateToken);

/**
 * POST /api/categoria
 * Create category (body: { nome, tipo })
 */
router.post("/", CategoriaController.createCategoria);

/**
 * GET /api/categoria
 * List categories for authenticated user
 */
router.get("/", CategoriaController.listCategorias);

/**
 * GET /api/categoria/:id
 * Get single category by id (owned by user)
 */
router.get("/:id", CategoriaController.getCategoria);

/**
 * PUT /api/categoria/:id
 * Update category owned by user
 */
router.put("/:id", CategoriaController.updateCategoria);

/**
 * DELETE /api/categoria/:id
 * Delete category owned by user
 */
router.delete("/:id", CategoriaController.deleteCategoria);

export default router;
