import * as CategoriaRepository from "../repository/CategoriaRepository.js";

export async function createCategoria(data, usuarioId) {
  if (!data.nome || !data.tipo) {
    const error = new Error("Nome e tipo são obrigatórios");
    error.status = 400;
    throw error;
  }

  return CategoriaRepository.createCategoria({
    nome: data.nome,
    tipo: data.tipo,
    usuarioId,
  });
}

export async function listCategorias(usuarioId) {
  return CategoriaRepository.listCategoriasByUsuario(usuarioId);
}

export async function getCategoriaById(id, usuarioId) {
  return CategoriaRepository.listCategoriaById(id, usuarioId);
}

export async function updateCategoria(id, usuarioId, data) {
  const existing = await getCategoriaById(id, usuarioId);
  if (!existing) {
    const error = new Error("Categoria não encontrada");
    error.status = 404;
    throw error;
  }

  await CategoriaRepository.updateCategoria(id, usuarioId, data);
  return getCategoriaById(id, usuarioId);
}

export async function deleteCategoria(id, usuarioId) {
  const existing = await getCategoriaById(id, usuarioId);
  if (!existing) {
    const error = new Error("Categoria não encontrada");
    error.status = 404;
    throw error;
  }

  return CategoriaRepository.deleteCategoria(id, usuarioId);
}
