import { Router } from 'express';
import * as MovimentacaoController from '../controllers/MovimentacaoController.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Movimentações
 *   description: Manage financial transactions (receitas e despesas)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Movimentacao:
 *       type: object
 *       required:
 *         - descricao
 *         - valor
 *         - data_movimentacao
 *         - transaction_type
 *       properties:
 *         id_movimentacao:
 *           type: integer
 *           description: Unique identifier for the transaction
 *         descricao:
 *           type: string
 *           description: Description of the transaction
 *         valor:
 *           type: number
 *           format: float
 *           description: Value of the transaction (positive for income, negative for expenses)
 *         data_movimentacao:
 *           type: string
 *           format: date
 *           description: Date when the transaction occurred
 *         transaction_type:
 *           type: string
 *           enum: [receita, despesa]
 *           description: Type of transaction
 *         usuario_id:
 *           type: integer
 *           description: ID of the user who owns this transaction
 *       example:
 *         id_movimentacao: 1
 *         descricao: Compra no supermercado
 *         valor: -250.75
 *         data_movimentacao: 2025-11-12
 *         transaction_type: despesa
 *         usuario_id: 1
 */

/**
 * @swagger
 * /api/movimentacao:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Movimentações]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Movimentacao'
 *     responses:
 *       201:
 *         description: Transaction created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movimentacao'
 */
router.post('/', MovimentacaoController.createMovimentacao);

/**
 * @swagger
 * /api/movimentacao/usuario/{usuario_id}:
 *   get:
 *     summary: List all transactions for a specific user
 *     tags: [Movimentações]
 *     parameters:
 *       - in: path
 *         name: usuario_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the user
 *     responses:
 *       200:
 *         description: List of transactions for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Movimentacao'
 *       404:
 *         description: No transactions found for this user
 */
router.get('/usuario/:usuario_id', MovimentacaoController.listMovimentacoesByUsuario);

/**
 * @swagger
 * /api/movimentacao/{id}:
 *   get:
 *     summary: Get a transaction by ID
 *     tags: [Movimentações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Transaction found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Movimentacao'
 *       404:
 *         description: Transaction not found
 */
router.get('/:id', MovimentacaoController.listMovimentacaoByID);

/**
 * @swagger
 * /api/movimentacao/{id}:
 *   put:
 *     summary: Update a transaction
 *     tags: [Movimentações]
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
 *             $ref: '#/components/schemas/Movimentacao'
 *     responses:
 *       200:
 *         description: Transaction updated
 */
router.put('/:id', MovimentacaoController.updateMovimentacao);

/**
 * @swagger
 * /api/movimentacao/{id}:
 *   delete:
 *     summary: Delete a transaction
 *     tags: [Movimentações]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Transaction deleted
 */
router.delete('/:id', MovimentacaoController.deleteMovimentacao);



export default router;
