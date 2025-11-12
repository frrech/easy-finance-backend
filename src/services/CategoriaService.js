import * as CategoriaRepository from "../repository/CategoriaRepository.js";

export async function createCategoria(categoriaData) {
  return await CategoriaRepository.createCategoria(categoriaData);
}

export async function listCategorias() {
  return await CategoriaRepository.listAllCategorias();
}

export async function getCategoriaById(id) {
  const categoria = await CategoriaRepository.listCategoriaById(id);
  if (!categoria) {
    throw new Error("Categoria not found");
  }
  return categoria;
}

export async function updateCategoria(id, data) {
  const [updated] = await CategoriaRepository.updateCategoria(id, data);
  if (!updated) {
    throw new Error("Categoria not found or not updated");
  }
  return await getCategoriaById(id);
}

export async function deleteCategoria(id) {
  const deleted = await CategoriaRepository.deleteCategoria(id);
  if (!deleted) {
    throw new Error("Categoria not found or already deleted");
  }
  return { message: "Categoria deleted successfully" };
}

export async function listCategoriasByUsuario(usuario_id) {
  return await CategoriaRepository.listCategoriasByUsuario(usuario_id);
}

