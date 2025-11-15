import { Categoria } from "../models/model.js";
import * as CategoriaService from "../services/CategoriaService.js";

export async function createCategoria(req, res) {
  try {
    const { nome, tipo } = req.body;

    const normalized = tipo?.toUpperCase();

    const validTypes = ["ENTRADA", "SAIDA"];
    if (!validTypes.includes(normalized)) {
      return res.status(400).json({
        message: "Tipo inválido. Use ENTRADA ou SAIDA."
      });
    }

    const categoria = await Categoria.create({
      nome,
      tipo: tipo.toLowerCase(),
      usuarioId: req.user.usuarioID   // ✔ correct FK
    });

    res.status(201).json(categoria);
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    res.status(500).json({ message: "Erro interno ao criar categoria" });
  }
}



export async function listCategorias(req, res) {
  try {
    const usuarioId = req.user.usuarioID;
    const categorias = await CategoriaService.listCategorias(usuarioId);
    return res.status(200).json(categorias);
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "Erro ao listar categorias",
    });
  }
}

export async function listCategoriaById(req, res) {
  try {
    const usuarioId = req.user.usuarioID;
    const id = Number(req.params.id);

    const categoria = await CategoriaService.getCategoriaById(id, usuarioId);

    if (!categoria)
      return res.status(404).json({ message: "Categoria não encontrada" });

    return res.status(200).json(categoria);
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "Erro ao buscar categoria",
    });
  }
}

export async function updateCategoria(req, res) {
  try {
    const usuarioId = req.user.usuarioID;
    const id = Number(req.params.id);

    const updated = await CategoriaService.updateCategoria(id, usuarioId, req.body);

    return res.status(200).json(updated);
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "Erro ao atualizar categoria",
    });
  }
}

export async function deleteCategoria(req, res) {
  try {
    const usuarioId = req.user.usuarioID;
    const id = Number(req.params.id);

    await CategoriaService.deleteCategoria(id, usuarioId);

    return res.status(204).send();
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "Erro ao excluir categoria",
    });
  }
}
