import { Categoria } from "../models/model.js";

async function createCategoria(data) {
  return await Categoria.create({
    nome: data.nome,
    tipo: data.tipo,
  });
}

async function listAllCategorias() {
  return await Categoria.findAll();
}

async function listCategoriaById(id) {
  return await Categoria.findByPk(id);
}

export async function listCategoriasByUsuario(usuario_id) {
  return await Categoria.findAll({ where: { usuario_id } });
}

async function updateCategoria(id, data) {
  return await Categoria.update(
    { nome: data.nome, tipo: data.tipo },
    { where: { id_categoria: id } }
  );
}

async function deleteCategoria(id) {
  return await Categoria.destroy({
    where: { id_categoria: id },
  });
}

export {
  createCategoria,
  listAllCategorias,
  listCategoriaById,
  updateCategoria,
  deleteCategoria,
};
