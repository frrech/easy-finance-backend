// repository/MovimentacaoRepository.js
import { Movimentacao } from "../models/model.js";

export async function createMovimentacao(payload) {
  return await Movimentacao.create({
    descricao: payload.descricao,
    valor: payload.valor,
    dataMovimentacao: payload.dataMovimentacao,
    tipo: payload.tipo, // "entrada" | "saida"
    categoriaId: payload.categoriaId,
    usuarioId: payload.usuarioId,
    arquivoMensalId: payload.arquivoMensalId ?? null,
  });
}

export async function listMovimentacoes() {
  return await Movimentacao.findAll();
}

export async function listMovimentacaoByID(id) {
  return await Movimentacao.findByPk(id);
}

export async function listMovimentacoesByUsuario(usuarioId) {
  return await Movimentacao.findAll({ where: { usuarioId } });
}

export async function listMovimentacoesByCategoria(categoriaId) {
  return await Movimentacao.findAll({ where: { categoriaId } });
}

export async function updateMovimentacao(id, payload) {
  const [count] = await Movimentacao.update(
    {
      descricao: payload.descricao,
      valor: payload.valor,
      dataMovimentacao: payload.dataMovimentacao,
      tipo: payload.tipo,
      categoriaId: payload.categoriaId,
      arquivoMensalId: payload.arquivoMensalId ?? null,
    },
    { where: { idMovimentacao: id } }
  );

  if (count === 0) return null;
  return Movimentacao.findByPk(id);
}

export async function deleteMovimentacao(id) {
  return await Movimentacao.destroy({ where: { idMovimentacao: id } });
}
