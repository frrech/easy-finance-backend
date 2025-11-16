// src/controllers/CategoriaController.ts
import { Request, Response } from "express";
import * as CategoriaService from "../services/CategoriaService.js";
import { Categoria } from "../models/model.js";

export async function createCategoria(req: Request, res: Response) {
  try {
    const { nome, tipo } = req.body;

    if (!nome || !tipo) {
      return res.status(400).json({ message: "Nome e tipo são obrigatórios." });
    }

    const normalized = tipo.toUpperCase();
    const validTypes = ["ENTRADA", "SAIDA"];

    if (!validTypes.includes(normalized)) {
      return res.status(400).json({
        message: "Tipo inválido. Use ENTRADA ou SAIDA."
      });
    }

    const categoria = await Categoria.create({
      nome,
      tipo: normalized.toLowerCase(), // save lowercase
      usuarioId: req.user.usuarioID
    });

    // ✔ Force FK to be visible in response
    return res.status(201).json({
      idCategoria: categoria.idCategoria,
      nome: categoria.nome,
      tipo: categoria.tipo,
      usuarioId: req.user.usuarioID
    });

  } catch (err: any) {
    console.error("Erro ao criar categoria:", err);
    return res.status(500).json({
      message: err.message || "Erro interno ao criar categoria"
    });
  }
}

export async function listCategorias(req: Request, res: Response) {
  try {
    const usuarioId = req.user.usuarioID;
    const categorias = await CategoriaService.listCategorias(usuarioId);
    return res.status(200).json(categorias);
  } catch (err: any) {
    return res.status(err.status || 500).json({
      message: err.message || "Erro ao listar categorias"
    });
  }
}

export async function listCategoriaById(req: Request, res: Response) {
  try {
    const usuarioId = req.user.usuarioID;
    const id = Number(req.params.id);

    const categoria = await CategoriaService.getCategoriaById(id, usuarioId);

    if (!categoria)
      return res.status(404).json({ message: "Categoria não encontrada" });

    return res.status(200).json(categoria);

  } catch (err: any) {
    return res.status(err.status || 500).json({
      message: err.message || "Erro ao buscar categoria"
    });
  }
}

export async function updateCategoria(req: Request, res: Response) {
  try {
    const usuarioId = req.user.usuarioID;
    const id = Number(req.params.id);

    const updated = await CategoriaService.updateCategoria(id, usuarioId, req.body);
    return res.status(200).json(updated);

  } catch (err: any) {
    return res.status(err.status || 500).json({
      message: err.message || "Erro ao atualizar categoria"
    });
  }
}

export async function deleteCategoria(req: Request, res: Response) {
  try {
    const usuarioId = req.user.usuarioID;
    const id = Number(req.params.id);

    await CategoriaService.deleteCategoria(id, usuarioId);
    return res.status(204).send();

  } catch (err: any) {
    return res.status(err.status || 500).json({
      message: err.message || "Erro ao excluir categoria"
    });
  }
}
