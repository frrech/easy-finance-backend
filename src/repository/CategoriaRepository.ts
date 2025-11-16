import { Categoria } from "../models/model.js";

export async function createCategoria({ nome, tipo, usuarioId }) {
  const c = await Categoria.create({ nome, tipo, usuarioId });

  return {
    id: c.idCategoria,
    nome: c.nome,
    tipo: c.tipo
  };
}

export async function listCategoriasByUsuario(usuarioId) {
  const cats = await Categoria.findAll({
    where: { usuarioId },
    order: [["createdAt", "DESC"]],
  });

  return cats.map(c => ({
    id: c.idCategoria,
    nome: c.nome,
    tipo: c.tipo
  }));
}

export async function listCategoriaById(id, usuarioId) {
  const c = await Categoria.findOne({
    where: {
      idCategoria: id,
      usuarioId,
    },
  });

  if (!c) return null;

  return {
    id: c.idCategoria,
    nome: c.nome,
    tipo: c.tipo
  };
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
