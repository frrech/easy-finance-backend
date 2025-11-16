import * as CategoriaRepository from "../repository/CategoriaRepository.js";
import { AppError } from "../types/AppError.js";

function toCategoriaResponse(model: any) {
  return {
    idCategoria: model.idCategoria ?? model.id ?? model.id_categoria,
    nome: model.nome,
    tipo: model.tipo,
    usuarioId: model.usuarioId
  };
}

export async function createCategoria(data: any, usuarioId: number) {
  if (!data.nome || !data.tipo) {
    throw new AppError("Nome e tipo são obrigatórios", 400);
  }

  const created = await CategoriaRepository.createCategoria({
    nome: data.nome,
    tipo: data.tipo,
    usuarioId
  });

  return toCategoriaResponse(created);
}

export async function listCategorias(usuarioId: number) {
  const list = await CategoriaRepository.listCategoriasByUsuario(usuarioId);
  return list.map(toCategoriaResponse);
}

export async function getCategoriaById(id: number, usuarioId: number) {
  const categoria = await CategoriaRepository.listCategoriaById(id, usuarioId);
  if (!categoria) return null;
  return toCategoriaResponse(categoria);
}

export async function updateCategoria(id: number, usuarioId: number, data: any) {
  const existing = await getCategoriaById(id, usuarioId);

  if (!existing) {
    throw new AppError("Categoria não encontrada", 404);
  }

  await CategoriaRepository.updateCategoria(id, usuarioId, data);

  const updated = await CategoriaRepository.listCategoriaById(id, usuarioId);
  return toCategoriaResponse(updated);
}

export async function deleteCategoria(id: number, usuarioId: number) {
  const existing = await getCategoriaById(id, usuarioId);

  if (!existing) {
    throw new AppError("Categoria não encontrada", 404);
  }

  return CategoriaRepository.deleteCategoria(id, usuarioId);
}
