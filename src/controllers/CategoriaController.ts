// src/controllers/CategoriaController.ts
import { Request, Response } from "express";
import * as CategoriaService from "../services/CategoriaService.js";
import { AppError } from "../types/AppError.js";

/**
 * Helper to send AppError responses uniformly.
 */
function handleAppError(err: any, res: Response) {
  if (err instanceof AppError) {
    return res.status(err.status || 400).json({ message: err.message });
  }
  console.error("❌ INTERNAL ERROR:", err);
  return res.status(500).json({
    message: err?.message ?? "Erro interno",
    error: process.env.NODE_ENV === "production" ? undefined : err,
  });
}

export async function createCategoria(req: Request, res: Response) {
  try {
    const usuarioId = Number(req.user?.id);
    if (!usuarioId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const created = await CategoriaService.createCategoria(req.body, usuarioId);
    return res.status(201).json(created);
  } catch (err: any) {
    return handleAppError(err, res);
  }
}

export async function listCategorias(req: Request, res: Response) {
  try {
    const usuarioId = Number(req.user?.id);
    if (!usuarioId) {
      return res.status(401).json({ message: "Usuário não autenticado" });
    }

    const list = await CategoriaService.listCategorias(usuarioId);
    return res.status(200).json(list);
  } catch (err: any) {
    return handleAppError(err, res);
  }
}

export async function getCategoria(req: Request, res: Response) {
  try {
    const usuarioId = Number(req.user?.id);
    const id = Number(req.params.id);
    if (!usuarioId) return res.status(401).json({ message: "Usuário não autenticado" });

    const categoria = await CategoriaService.getCategoriaById(id, usuarioId);
    if (!categoria) return res.status(404).json({ message: "Categoria não encontrada" });

    return res.status(200).json(categoria);
  } catch (err: any) {
    return handleAppError(err, res);
  }
}

export async function updateCategoria(req: Request, res: Response) {
  try {
    const usuarioId = Number(req.user?.id);
    const id = Number(req.params.id);
    if (!usuarioId) return res.status(401).json({ message: "Usuário não autenticado" });

    const updated = await CategoriaService.updateCategoria(id, usuarioId, req.body);
    return res.status(200).json(updated);
  } catch (err: any) {
    return handleAppError(err, res);
  }
}

export async function deleteCategoria(req: Request, res: Response) {
  try {
    const usuarioId = Number(req.user?.id);
    const id = Number(req.params.id);
    if (!usuarioId) return res.status(401).json({ message: "Usuário não autenticado" });

    await CategoriaService.deleteCategoria(id, usuarioId);
    return res.status(204).send();
  } catch (err: any) {
    return handleAppError(err, res);
  }
}
