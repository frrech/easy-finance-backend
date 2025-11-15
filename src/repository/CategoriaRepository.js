import { Categoria } from "../models/model.js";

export async function createCategoria({ nome, tipo, usuarioId }) {
  return await Categoria.create({
    nome,
    tipo,
    usuarioId
  });
}

export async function listCategoriasByUsuario(usuarioId) {
  return await Categoria.findAll({
    where: { usuarioId },
    order: [["createdAt", "DESC"]],
  });
}

export async function listCategoriaById(id, usuarioId) {
  return await Categoria.findOne({
    where: {
      idCategoria: id,
      usuarioId,
    },
  });
}

export async function updateCategoria(id, usuarioId, data) {
  return await Categoria.update(
    {
      nome: data.nome,
      tipo: data.tipo,
    },
    {
      where: { idCategoria: id, usuarioId },
    }
  );
}

export async function deleteCategoria(id, usuarioId) {
  return await Categoria.destroy({
    where: { idCategoria: id, usuarioId },
  });
}
