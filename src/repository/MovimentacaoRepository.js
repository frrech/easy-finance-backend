import { Movimentacao } from "../models/model.js";

export async function createMovimentacao(payload) {
  return await Movimentacao.create({
    descricao: payload.descricao,
    valor: payload.valor,
    data_movimentacao: payload.data_movimentacao,
    transaction_type: payload.transaction_type,
    id_categoria: payload.id_categoria,
    id_usuario: payload.id_usuario,
  });
}

export async function listMovimentacoes() {
  return await Movimentacao.findAll();
}

export async function listMovimentacaoByID(id) {
  return await Movimentacao.findByPk(id);
}

export async function listMovimentacoesByUsuario(usuario_id) {
  return await Movimentacao.findAll({ where: { id_usuario: usuario_id } });
}

export async function listMovimentacoesByCategoria(categoria_id) {
  return await Movimentacao.findAll({ where: { id_categoria: categoria_id } });
}

export async function updateMovimentacao(id, payload) {
  const [updatedCount] = await Movimentacao.update(
    {
      descricao: payload.descricao,
      valor: payload.valor,
      data_movimentacao: payload.data_movimentacao,
      transaction_type: payload.transaction_type,
      id_categoria: payload.id_categoria,
    },
    { where: { id_movimentacao: id } }
  );

  if (updatedCount === 0) return null;
  return await Movimentacao.findByPk(id);
}

export async function deleteMovimentacao(id) {
  return await Movimentacao.destroy({
    where: { id_movimentacao: id },
  });
}
