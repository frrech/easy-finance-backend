import { Router } from 'express';
import * as UsuarioController from '../controllers/UsuarioController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Endpoints for managing users
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       required:
 *         - nome
 *         - email
 *         - senha
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID
 *         nome:
 *           type: string
 *           description: User name
 *         email:
 *           type: string
 *           format: email
 *           description: User email
 *         senha:
 *           type: string
 *           description: User password
 *       example:
 *         nome: João Silva
 *         email: joao@email.com
 *         senha: 123456
 */

/**
 * @swagger
 * /api/usuario:
 *   post:
 *     summary: Create a new user
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 */
router.post('/', UsuarioController.createUsuario);

/**
 * @swagger
 * /api/usuario/me:
 *   get:
 *     summary: Get the currently authenticated user's data
 *     tags: [Usuários]
 *     security:
 *       - bearerAuth: []      # 👈 requires Bearer token
 *     responses:
 *       200:
 *         description: Returns the logged-in user's info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 idUsuario:
 *                   type: integer
 *                   example: 1
 *                 nome:
 *                   type: string
 *                   example: João Silva
 *                 email:
 *                   type: string
 *                   example: joao@email.com
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Token ausente
 *       403:
 *         description: Token inválido ou expirado
 */
router.get('/me', authenticateToken, UsuarioController.getCurrentUsuario);

/**
 * @swagger
 * /api/usuario/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       404:
 *         description: User not found
 */
router.get('/:id', UsuarioController.listUsuarioByID);

/**
 * @swagger
 * /api/usuario/{id}:
 *   put:
 *     summary: Update a user
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Usuario'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: User not found
 */
router.put('/:id', UsuarioController.updateUsuario);

/**
 * @swagger
 * /api/usuario/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Usuários]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/:id', UsuarioController.deleteUsuario);

/**
 * @swagger
 * /api/usuario/login:
 *   post:
 *     summary: Authenticate a user and return a JWT token
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - senha
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: joao@email.com
 *               senha:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Missing or invalid credentials
 *       401:
 *         description: Unauthorized (invalid password or user not found)
 */
router.post('/login', UsuarioController.loginUsuario);

export default router;
