// src/services/CategoriaService.ts
import * as CategoriaRepository from "../repository/CategoriaRepository.js";
import { AppError } from "../types/AppError.js";

/**
 * Normalize and validate tipo from arbitrary input.
 * Throws AppError(400) if invalid.
 */
function normalizeTipo(raw: unknown): "entrada" | "saida" {
  if (typeof raw !== "string") {
    throw new AppError("Tipo inválido", 400);
  }

  const t = raw.trim().toLowerCase();
  if (t !== "entrada" && t !== "saida") {
    throw new AppError("Tipo inválido. Use 'entrada' ou 'saida'.", 400);
  }
  return t as "entrada" | "saida";
}

/**
 * Map repository model to API response shape.
 * Exposes idCategoria for backward compatibility with older clients.
 */
function toCategoriaResponse(model: any) {
  return {
    idCategoria: model.idCategoria ?? model.id ?? model.id_categoria,
    id: model.id ?? model.idCategoria ?? model.id_categoria,
    nome: model.nome,
    tipo: model.tipo,
    usuarioId: model.usuarioId,
  };
}

export async function createCategoria(
  data: { nome?: unknown; tipo?: unknown },
  usuarioId: number
) {
  if (!data.nome || typeof data.nome !== "string" || data.nome.trim() === "") {
    throw new AppError("Nome é obrigatório", 400);
  }
  const nome = data.nome.trim();
  const tipo = normalizeTipo(data.tipo);

  const created = await CategoriaRepository.createCategoria({
    nome,
    tipo,
    usuarioId,
  });

  return toCategoriaResponse(created);
}

export async function listCategorias(usuarioId: number) {
  const list = await CategoriaRepository.listCategoriasByUsuario(usuarioId);
  return list.map(toCategoriaResponse);
}

export async function getCategoriaById(id: number, usuarioId: number) {
  const categoria = await CategoriaRepository.findCategoriaById(id, usuarioId);
  if (!categoria) return null;
  return toCategoriaResponse(categoria);
}

export async function updateCategoria(
  id: number,
  usuarioId: number,
  data: { nome?: unknown; tipo?: unknown }
) {
  // Check existence
  const existing = await getCategoriaById(id, usuarioId);
  if (!existing) {
    throw new AppError("Categoria não encontrada", 404);
  }

  const payload: { nome?: string; tipo?: "entrada" | "saida" } = {};

  if (data.nome !== undefined) {
    if (typeof data.nome !== "string" || data.nome.trim() === "") {
      throw new AppError("Nome inválido", 400);
    }
    payload.nome = data.nome.trim();
  }

  if (data.tipo !== undefined) {
    payload.tipo = normalizeTipo(data.tipo);
  }

  const updated = await CategoriaRepository.updateCategoria(id, usuarioId, payload);
  if (!updated) {
    throw new AppError("Falha ao atualizar categoria", 500);
  }

  return toCategoriaResponse(updated);
}

export async function deleteCategoria(id: number, usuarioId: number) {
  const existing = await getCategoriaById(id, usuarioId);

  if (!existing) {
    throw new AppError("Categoria não encontrada", 404);
  }

  const ok = await CategoriaRepository.deleteCategoria(id, usuarioId);
  if (!ok) {
    throw new AppError("Falha ao excluir categoria", 500);
  }

  // return nothing (controller will send 204)
  return;
}
