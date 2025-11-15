// services/MovimentacaoService.js
import * as MovimentacaoRepository from "../repository/MovimentacaoRepository.js";

function validateMovimentacao(m) {
  return (
    m &&
    typeof m.descricao === "string" &&
    m.descricao.trim() !== "" &&
    typeof m.valor === "number" &&
    isFinite(m.valor) &&
    ["entrada", "saida"].includes(m.tipo) &&
    m.dataMovimentacao &&
    m.categoriaId &&
    m.usuarioId
  );
}

export async function createMovimentacao(mov) {
  if (!validateMovimentacao(mov)) {
    throw { status: 400, message: "Campos inválidos na movimentação" };
  }
  return await MovimentacaoRepository.createMovimentacao(mov);
}

export async function listMovimentacaoByID(id) {
  if (!id || id <= 0) {
    throw { status: 400, message: "ID inválido!" };
  }

  const mov = await MovimentacaoRepository.listMovimentacaoByID(id);
  if (!mov) {
    throw { status: 404, message: "Movimentação não encontrada!" };
  }

  return mov;
}

export async function listMovimentacoesByUsuario(usuarioId) {
  if (!usuarioId || typeof usuarioId !== "number") {
    throw { status: 400, message: "Usuário inválido!" };
  }

  const movs = await MovimentacaoRepository.listMovimentacoesByUsuario(usuarioId);
  if (!movs || movs.length === 0) {
    throw { status: 404, message: "Nenhuma movimentação encontrada para este usuário." };
  }

  return movs;
}

export async function updateMovimentacao(id, mov) {
  if (!id || id <= 0) {
    throw { status: 400, message: "ID inválido!" };
  }
  if (!validateMovimentacao(mov)) {
    throw { status: 400, message: "Campos inválidos na movimentação" };
  }

  const updated = await MovimentacaoRepository.updateMovimentacao(id, mov);
  if (!updated) {
    throw { status: 404, message: "Movimentação não encontrada!" };
  }

  return updated;
}

export async function deleteMovimentacao(id) {
  if (!id || id <= 0) {
    throw { status: 400, message: "ID inválido!" };
  }

  const deleted = await MovimentacaoRepository.deleteMovimentacao(id);
  if (!deleted) {
    throw { status: 404, message: "Movimentação não encontrada!" };
  }

  return { message: "Movimentação removida com sucesso." };
}
