import * as MovRepo from "../repository/MovimentacaoRepository.js";
import * as CatRepo from "../repository/CategoriaRepository.js";
import { AppError } from "../types/AppError.js";

function validateData(data) {
  if (!data.descricao || typeof data.descricao !== "string") {
    throw new AppError("Descrição obrigatória", 400);
  }

  if (data.valor === undefined || isNaN(Number(data.valor))) {
    throw new AppError("Valor inválido", 400);
  }

  if (!data.dataMovimentacao) {
    throw new AppError("Data da movimentação obrigatória", 400);
  }

  if (!data.categoriaId) {
    throw new AppError("Categoria obrigatória", 400);
  }
}

export async function createMovimentacao(data, usuarioId) {
  validateData(data);

  // validate categoria
  const categoria = await CatRepo.findCategoriaById(data.categoriaId, usuarioId);
  if (!categoria) throw new AppError("Categoria não encontrada", 404);

  // tipo IS ALWAYS determined by category
  const tipo = categoria.tipo;

  return await MovRepo.createMovimentacao({
    ...data,
    tipo,
    usuarioId,
  });
}

export async function getMovimentacaoById(id, usuarioId) {
  const mov = await MovRepo.getMovimentacaoById(id, usuarioId);
  if (!mov) throw new AppError("Movimentação não encontrada", 404);
  return mov;
}

export async function listMovimentacoesByUsuario(usuarioId) {
  return MovRepo.listMovimentacoesByUsuario(usuarioId);
}

export async function updateMovimentacao(id, usuarioId, data) {
  const existing = await MovRepo.getMovimentacaoById(id, usuarioId);
  if (!existing) throw new AppError("Movimentação não encontrada", 404);

  // If categoria changes, update tipo automatically
  if (data.categoriaId !== undefined) {
    const categoria = await CatRepo.findCategoriaById(data.categoriaId, usuarioId);
    if (!categoria) throw new AppError("Categoria inválida", 400);
    data.tipo = categoria.tipo;
  } else {
    // keep old tipo
    data.tipo = existing.tipo;
  }

  const updated = await MovRepo.updateMovimentacao(id, usuarioId, data);
  if (!updated) throw new AppError("Movimentação não encontrada", 404);
  return updated;
}

export async function deleteMovimentacao(id, usuarioId) {
  const deleted = await MovRepo.deleteMovimentacao(id, usuarioId);
  if (!deleted) throw new AppError("Movimentação não encontrada", 404);
}
