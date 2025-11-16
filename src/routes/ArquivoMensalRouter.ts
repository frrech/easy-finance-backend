import { Router } from "express";
import * as ArquivoMensalController from "../controllers/ArquivoMensalController.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Arquivos Mensais
 *   description: Manage uploaded monthly files
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ArquivoMensal:
 *       type: object
 *       required:
 *         - mes
 *         - ano
 *       properties:
 *         id_arquivo_mensal:
 *           type: integer
 *         mes:
 *           type: integer
 *           description: Month (1–12)
 *         ano:
 *           type: integer
 *           description: Year of the record
 *         saldo_final:
 *           type: number
 *           format: float
 *         caminho_arquivo:
 *           type: string
 *           nullable: true
 *         usuario_id:
 *           type: integer
 *           description: User ID that owns the file
 *       example:
 *         id_arquivo_mensal: 1
 *         mes: 1
 *         ano: 2025
 *         saldo_final: 2500.75
 *         caminho_arquivo: /uploads/janeiro.csv
 *         usuario_id: 2
 */

/**
 * @swagger
 * /api/arquivo:
 *   post:
 *     summary: Upload a monthly file
 *     tags: [Arquivos Mensais]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ArquivoMensal'
 *     responses:
 *       201:
 *         description: File created successfully
 */
router.post("/", ArquivoMensalController.createArquivoMensal);

/**
 * @swagger
 * /api/arquivo/usuario/{usuario_id}:
 *   get:
 *     summary: List all monthly files for a specific user
 *     tags: [Arquivos Mensais]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of user’s monthly files
 */
router.get(
  "/usuario/:usuario_id",
  ArquivoMensalController.listArquivosByUsuario
);

/**
 * @swagger
 * /api/arquivo/{id}:
 *   get:
 *     summary: Get a monthly file by ID
 *     tags: [Arquivos Mensais]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 */
router.get("/:id", ArquivoMensalController.listArquivoByID);

/**
 * @swagger
 * /api/arquivo/{id}:
 *   put:
 *     summary: Update a monthly file
 *     tags: [Arquivos Mensais]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 */
router.put("/:id", ArquivoMensalController.updateArquivoMensal);

/**
 * @swagger
 * /api/arquivo/{id}:
 *   delete:
 *     summary: Delete a monthly file
 *     tags: [Arquivos Mensais]
 */
router.delete("/:id", ArquivoMensalController.deleteArquivo);

export default router;
