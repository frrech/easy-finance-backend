import * as CategoriaRepository from "../repository/CategoriaRepository";
import { AppError } from "../types/AppError";

export async function createCategoria(data: any, usuarioId: number) {
  if (!data.nome || !data.tipo) {
    throw new AppError("Nome e tipo são obrigatórios", 400);
  }

  return CategoriaRepository.createCategoria({
    nome: data.nome,
    tipo: data.tipo,
    usuarioId,
  });
}

export async function listCategorias(usuarioId: number) {
  return CategoriaRepository.listCategoriasByUsuario(usuarioId);
}

export async function getCategoriaById(id: number, usuarioId: number) {
  return CategoriaRepository.listCategoriaById(id, usuarioId);
}

export async function updateCategoria(id: number, usuarioId: number, data: any) {
  const existing = await getCategoriaById(id, usuarioId);
  if (!existing) {
    throw new AppError("Categoria não encontrada", 404);
  }

  await CategoriaRepository.updateCategoria(id, usuarioId, data);
  return getCategoriaById(id, usuarioId);
}

export async function deleteCategoria(id: number, usuarioId: number) {
  const existing = await getCategoriaById(id, usuarioId);
  if (!existing) {
    throw new AppError("Categoria não encontrada", 404);
  }

  return CategoriaRepository.deleteCategoria(id, usuarioId);
}
