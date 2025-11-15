import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Usuario } from "../models/model.js";

const router = express.Router();

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;

    // 1️⃣ Find user
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    // 2️⃣ Check password
    const isMatch = await bcrypt.compare(senha, usuario.senha);
    if (!isMatch) {
      return res.status(401).json({ message: "Senha incorreta" });
    }

    // 3️⃣ Generate JWT token
    const token = jwt.sign(
      { usuarioID: usuario.usuarioID, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    // 4️⃣ Return token and user data (excluding senha)
    const { senha: _, ...userData } = usuario.toJSON();

    res.status(200).json({
      message: "Login bem-sucedido!",
      token,
      user: userData
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ message: "Erro interno no servidor" });
  }
});

export default router;
