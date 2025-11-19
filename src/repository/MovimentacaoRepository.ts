// src/repository/MovimentacaoRepository.ts
import { Movimentacao } from "../models/Movimentacao.js";
import { Categoria } from "../models/Categoria.js";

export async function createMovimentacao(data) {
  const mov = await Movimentacao.create({
    descricao: data.descricao,
    valor: data.valor,
    dataMovimentacao: data.dataMovimentacao,
    tipo: data.tipo,
    categoriaId: data.categoriaId,
    usuarioId: data.usuarioId,
  });

  return getMovimentacaoById(mov.id, data.usuarioId);
}

export async function getMovimentacaoById(id, usuarioId) {
  const mov = await Movimentacao.findOne({
    where: { id, usuarioId },
    include: [
      {
        model: Categoria,
        as: "categoria",
        attributes: ["id", "nome", "tipo"],
      },
    ],
  });

  if (!mov) return null;

  return {
    idMovimentacao: mov.id,
    descricao: mov.descricao,
    valor: mov.valor,
    dataMovimentacao: mov.dataMovimentacao,
    tipo: mov.tipo,
    categoria: mov.categoria
      ? {
          idCategoria: mov.categoria.id,
          nome: mov.categoria.nome,
          tipo: mov.categoria.tipo,
        }
      : null,
    usuarioId: mov.usuarioId,
  };
}

export async function listMovimentacoesByUsuario(usuarioId) {
  const result = await Movimentacao.findAll({
    where: { usuarioId },
    include: [
      {
        model: Categoria,
        as: "categoria",              // <-- REQUIRED
        attributes: ["id", "nome", "tipo"],
      },
    ],
    order: [["dataMovimentacao", "DESC"]],
  });

  return result.map((mov) => ({
    idMovimentacao: mov.id,
    descricao: mov.descricao,
    valor: mov.valor,
    dataMovimentacao: mov.dataMovimentacao,
    tipo: mov.tipo,
    categoria: mov.categoria
      ? {
          idCategoria: mov.categoria.id,
          nome: mov.categoria.nome,
          tipo: mov.categoria.tipo,
        }
      : null,
    usuarioId: mov.usuarioId,
  }));
}


export async function updateMovimentacao(id, usuarioId, data) {
  const mov = await Movimentacao.findOne({ where: { id, usuarioId } });
  if (!mov) return null;

  if (data.descricao !== undefined) mov.descricao = data.descricao;
  if (data.valor !== undefined) mov.valor = data.valor;
  if (data.dataMovimentacao !== undefined)
    mov.dataMovimentacao = data.dataMovimentacao;
  if (data.tipo !== undefined) mov.tipo = data.tipo;
  if (data.categoriaId !== undefined) mov.categoriaId = data.categoriaId;

  await mov.save();

  return getMovimentacaoById(id, usuarioId);
}

export async function deleteMovimentacao(id, usuarioId) {
  const deleted = await Movimentacao.destroy({
    where: { id, usuarioId },
  });

  return deleted > 0;
}
