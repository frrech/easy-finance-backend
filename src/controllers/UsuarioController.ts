import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { Usuario } from "../models/model.js";
import * as UsuarioRepository from "../repository/UsuarioRepository.js";
import * as UsuarioService from "../services/UsuarioService.js";

// ------------------------------
// Types
// ------------------------------
export interface JwtPayload {
  usuarioID: number;
  email: string;
}

// ------------------------------
// CREATE USER
// ------------------------------
export async function createUsuario(req: Request, res: Response): Promise<Response> {
  try {
    console.log("📩 Incoming body:", req.body);

    const usuario = await Usuario.create(req.body);
    const { senha, ...safeUser } = usuario.toJSON();

    return res.status(201).json(safeUser);

  } catch (err) {
    console.error("❌ Error creating user:", err);
    return res.status(500).json({ message: "Erro ao criar usuário" });
  }
}

// ------------------------------
// GET USER BY ID
// ------------------------------
export async function listUsuarioByID(req: Request, res: Response): Promise<Response> {
  try {
    const id = Number(req.params.id);
    const usuario = await UsuarioService.listUsuarioByID(id);

    return res.status(200).json(usuario);

  } catch (err: any) {
    return res.status(err?.status || 500).json({
      message: err?.message || "Erro interno do servidor",
    });
  }
}

// ------------------------------
// LOGIN USER
// ------------------------------
export async function loginUsuario(req: Request, res: Response): Promise<Response> {
  try {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const passwordMatch = await bcrypt.compare(String(senha), usuario.senha);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Senha incorreta" });
    }

    // Runtime check
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in environment variables");
    }

    // Compile-time assertion for TS
    const secret = process.env.JWT_SECRET!;

    const token = jwt.sign(
      { usuarioID: usuario.usuarioID, email: usuario.email },
      secret,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login bem-sucedido!",
      token,
      usuario: {
        usuarioID: usuario.usuarioID,
        nome: usuario.nome,
        email: usuario.email
      }
    });

  } catch (err) {
    console.error("❌ Erro no loginUsuario:", err);
    return res.status(500).json({ message: "Erro interno no login" });
  }
}

// ------------------------------
// GET CURRENT USER
// ------------------------------
export async function getCurrentUsuario(req: Request, res: Response): Promise<Response> {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Não autenticado" });
    }

    const { usuarioID } = req.user;

    const usuario = await UsuarioRepository.findById(usuarioID);

    if (!usuario) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    return res.status(200).json({
      usuarioID: usuario.usuarioID,
      nome: usuario.nome,
      email: usuario.email
    });

  } catch (err) {
    console.error("❌ Error in getCurrentUsuario:", err);
    return res.status(500).json({ message: "Erro interno ao buscar o usuário atual" });
  }
}

// ------------------------------
// UPDATE USER
// ------------------------------
export async function updateUsuario(req: Request, res: Response): Promise<Response> {
  try {
    const id = Number(req.params.id);

    const [affected] = await Usuario.update(req.body, {
      where: { usuarioID: id }
    });

    if (affected === 0) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    const updatedUser = await Usuario.findByPk(id);

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuário não encontrado após update" });
    }

    const { senha, ...safeUser } = updatedUser.toJSON();

    return res.status(200).json(safeUser);

  } catch (err) {
    console.error("❌ Erro ao atualizar usuário:", err);
    return res.status(500).json({ message: "Erro ao atualizar usuário" });
  }
}

// ------------------------------
// DELETE USER
// ------------------------------
export async function deleteUsuario(req: Request, res: Response): Promise<Response> {
  try {
    const id = Number(req.params.id);
    await UsuarioService.deleteUsuario(id);
    return res.status(204).send();

  } catch (err: any) {
    return res.status(err?.status || 500).json({
      message: err?.message || "Erro interno do servidor"
    });
  }
}
