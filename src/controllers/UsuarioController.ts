import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import * as UsuarioService from "../services/UsuarioService.js";
import * as UsuarioRepository from "../repository/UsuarioRepository.js";

import {
  UsuarioCreateDTO,
  UsuarioLoginDTO
} from "../dtos/UsuarioDTO.js";

// CREATE
export async function createUsuario(req: Request, res: Response) {
  try {
    const dto: UsuarioCreateDTO = req.body;
    const usuario = await UsuarioService.createUsuario(dto);
    return res.status(201).json(usuario);
 } catch (err: any) {
  console.error("❌ INTERNAL ERROR:", err);
  return res.status(500).json({
    message: err.message ?? "Erro interno",
    error: err, // optional
  });
}

}

// LOGIN
export async function loginUsuario(req: Request, res: Response) {
  try {
    const dto: UsuarioLoginDTO = req.body;
    const usuario = await UsuarioService.loginUsuario(dto);

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ message: "Login bem-sucedido!", token, usuario });
  } catch (err: any) {
  console.error("❌ INTERNAL ERROR:", err);
  return res.status(500).json({
    message: err.message ?? "Erro interno",
    error: err, // optional
  });
}

}

// ME
export async function getCurrentUsuario(req: Request, res: Response) {
  try {
    if (!req.user)
      return res.status(401).json({ message: "Não autenticado" });

    const usuario = await UsuarioRepository.findById(req.user.id);
    if (!usuario)
      return res.status(404).json({ message: "Usuário não encontrado" });

    return res.status(200).json(usuario);
 } catch (err: any) {
  console.error("❌ INTERNAL ERROR:", err);
  return res.status(500).json({
    message: err.message ?? "Erro interno",
    error: err, // optional
  });
}

}

// GET BY ID
export async function listUsuarioByID(req: Request, res: Response) {
  try {
    const usuario = await UsuarioService.listUsuarioByID(Number(req.params.id));
    return res.status(200).json(usuario);
 } catch (err: any) {
  console.error("❌ INTERNAL ERROR:", err);
  return res.status(500).json({
    message: err.message ?? "Erro interno",
    error: err, // optional
  });
}

}

// UPDATE
export async function updateUsuario(req: Request, res: Response) {
  try {
    const dto: UsuarioCreateDTO = req.body;
    const updated = await UsuarioService.updateUsuario(Number(req.params.id), dto);
    return res.status(200).json(updated);
 } catch (err: any) {
  console.error("❌ INTERNAL ERROR:", err);
  return res.status(500).json({
    message: err.message ?? "Erro interno",
    error: err, // optional
  });
}

}

// DELETE
export async function deleteUsuario(req: Request, res: Response) {
  try {
    await UsuarioService.deleteUsuario(Number(req.params.id));
    return res.status(204).send();
 } catch (err: any) {
  console.error("❌ INTERNAL ERROR:", err);
  return res.status(500).json({
    message: err.message ?? "Erro interno",
    error: err, // optional
  });
}

}
