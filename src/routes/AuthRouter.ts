import { Router, Request, Response } from "express";
import * as jwt from "jsonwebtoken";  // namespace import
import bcrypt from "bcryptjs";
import { Usuario } from "../models/Usuario.js";

const router = Router();

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    const isMatch = await bcrypt.compare(String(senha), usuario.senha);
    if (!isMatch) {
      return res.status(401).json({ message: "Senha incorreta" });
    }

    const secret = process.env.JWT_SECRET as string;
    const expiresIn = (process.env.JWT_EXPIRES_IN ?? "1h") as string;

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      secret,
      { expiresIn } as jwt.SignOptions    // <── THE FIX
    );

    const { senha: _, ...userData } = usuario.toJSON();

    return res.status(200).json({
      message: "Login bem-sucedido!",
      token,
      user: userData,
    });

  } catch (err) {
    console.error("Erro no login:", err);
    return res.status(500).json({ message: "Erro interno no servidor" });
  }
});

export default router;
