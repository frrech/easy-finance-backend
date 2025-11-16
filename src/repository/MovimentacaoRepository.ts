import { Movimentacao, Categoria } from "../models/model.js";

export async function createMovimentacao(data) {
  return Movimentacao.create({
    descricao: data.descricao,
    valor: data.valor,
    dataMovimentacao: data.dataMovimentacao, // FIXED
    tipo: data.tipo,
    categoriaId: data.categoriaId,
    usuarioId: data.usuarioId,
  });
}

export async function listMovimentacaoByID(id) {
  return Movimentacao.findByPk(id, {
    include: [
      {
        model: Categoria,
        attributes: ["idCategoria", "nome", "tipo"],
      },
    ],
  });
}

export async function listMovimentacoesByUsuario(usuarioId) {
  return Movimentacao.findAll({
    where: { usuarioId },
    include: [
      {
        model: Categoria,
        attributes: ["idCategoria", "nome", "tipo"],
      },
    ],
    order: [["dataMovimentacao", "DESC"]],
  });
}

export async function updateMovimentacao(id, data) {
  const [count] = await Movimentacao.update(
    {
      descricao: data.descricao,
      valor: data.valor,
      dataMovimentacao: data.dataMovimentacao, // FIXED
      tipo: data.tipo,
      categoriaId: data.categoriaId,
      usuarioId: data.usuarioId,
    },
    {
      where: { idMovimentacao: id },
    }
  );

  if (count === 0) return null;

  return listMovimentacaoByID(id);
}

export async function deleteMovimentacao(id, usuarioId) {
  return Movimentacao.destroy({
    where: { idMovimentacao: id, usuarioId },
  });
}
