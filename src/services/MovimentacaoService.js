import * as MovimentacaoRepository from "../repository/MovimentacaoRepository.js";

function validateMovimentacao(movimentacao) {
  return (
    movimentacao &&
    typeof movimentacao.descricao === "string" &&
    movimentacao.descricao.trim() !== "" &&
    typeof movimentacao.valor === "number" &&
    isFinite(movimentacao.valor) &&
    typeof movimentacao.transaction_type === "string" &&
    ["receita", "despesa"].includes(movimentacao.transaction_type.toLowerCase()) &&
    movimentacao.data_movimentacao
  );
}

export async function createMovimentacao(movimentacao) {
  if (!validateMovimentacao(movimentacao)) {
    throw { status: 400, message: "Campos vazios ou inválidos!" };
  }
  return await MovimentacaoRepository.createMovimentacao(movimentacao);
}

export async function listMovimentacaoByID(id) {
  if (typeof id !== "number" || id <= 0) {
    throw { status: 400, message: "ID inválido!" };
  }

  const mov = await MovimentacaoRepository.listMovimentacaoByID(id);
  if (!mov) {
    throw { status: 404, message: "Movimentação não encontrada!" };
  }

  return mov;
}

export async function listMovimentacoesByUsuario(usuario_id) {
  if (!usuario_id || typeof usuario_id !== "number") {
    throw { status: 400, message: "ID de usuário inválido!" };
  }

  const movs = await MovimentacaoRepository.listMovimentacoesByUsuario(usuario_id);
  if (!movs || movs.length === 0) {
    throw { status: 404, message: "Nenhuma movimentação encontrada para este usuário." };
  }

  return movs;
}

export async function updateMovimentacao(id, movimentacao) {
  if (!id || id <= 0) {
    throw { status: 400, message: "ID inválido!" };
  }
  if (!validateMovimentacao(movimentacao)) {
    throw { status: 400, message: "Campos de movimentação preenchidos incorretamente" };
  }

  const updated = await MovimentacaoRepository.updateMovimentacao(id, movimentacao);
  if (!updated) {
    throw { status: 404, message: "Movimentação não encontrada!" };
  }

  return updated;
}

export async function deleteMovimentacao(id) {
  if (!id || id <= 0) {
    throw { status: 400, message: "ID inválido!" };
  }

  const deletedCount = await MovimentacaoRepository.deleteMovimentacao(id);
  if (!deletedCount) {
    throw { status: 404, message: "Movimentação não encontrada!" };
  }

  return { message: "Movimentação excluída com sucesso." };
}
