// src/controllers/MovimentacaoController.ts
import * as MovService from "../services/MovimentacaoService.js";
import { AppError } from "../types/AppError.js";

function handleError(err, res) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ message: err.message });
  }
  console.error("❌ INTERNAL ERROR:", err);
  return res.status(500).json({ message: "Erro interno" });
}

export async function createMovimentacao(req, res) {
  try {
    const usuarioId = req.user.id;
    const mov = await MovService.createMovimentacao(req.body, usuarioId);
    return res.status(201).json(mov);
  } catch (err) {
    return handleError(err, res);
  }
}

export async function updateMovimentacao(req, res) {
  try {
    const usuarioId = req.user.id;
    const id = Number(req.params.id);

    const updated = await MovService.updateMovimentacao(id, usuarioId, req.body);
    return res.status(200).json(updated);
  } catch (err) {
    return handleError(err, res);
  }
}

export async function getMovimentacao(req, res) {
  try {
    const usuarioId = req.user.id;
    const id = Number(req.params.id);
    const mov = await MovService.getMovimentacaoById(id, usuarioId);
    return res.status(200).json(mov);
  } catch (err) {
    return handleError(err, res);
  }
}

export async function listMovimentacoes(req, res) {
  try {
    const usuarioId = req.user.id;
    const list = await MovService.listMovimentacoesByUsuario(usuarioId);
    return res.status(200).json(list);
  } catch (err) {
    return handleError(err, res);
  }
}

export async function deleteMovimentacao(req, res) {
  try {
    const usuarioId = req.user.id;
    const id = Number(req.params.id);
    await MovService.deleteMovimentacao(id, usuarioId);
    return res.status(204).send();
  } catch (err) {
    return handleError(err, res);
  }
}
