import * as MovimentacaoRepository from "../repository/MovimentacaoRepository.js";
import { Categoria } from "../models/model.js";

function validateMovimentacao(m) {
  return (
    m &&
    typeof m.descricao === "string" &&
    m.descricao.trim() !== "" &&
    typeof m.valor === "number" &&
    isFinite(m.valor) &&
    ["entrada", "saida"].includes(m.tipo) &&
    m.dataMovimentacao &&                 // OK
    Number.isInteger(m.categoriaId) &&
    Number.isInteger(m.usuarioId)
  );
}

export async function createMovimentacao(mov) {
  if (!validateMovimentacao(mov)) {
    throw { status: 400, message: "Campos inválidos na movimentação" };
  }

  // Category must belong to user
  const categoria = await Categoria.findOne({
    where: {
      idCategoria: mov.categoriaId,
      usuarioId: mov.usuarioId,
    },
  });

  if (!categoria) {
    throw { status: 403, message: "Categoria não pertence ao usuário." };
  }

  return MovimentacaoRepository.createMovimentacao(mov);
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

  return (await MovimentacaoRepository.listMovimentacoesByUsuario(usuarioId)) || [];
}

export async function updateMovimentacao(id, mov) {
  if (!id || id <= 0) {
    throw { status: 400, message: "ID inválido!" };
  }

  if (!validateMovimentacao(mov)) {
    throw { status: 400, message: "Campos inválidos na movimentação" };
  }

  const categoria = await Categoria.findOne({
    where: {
      idCategoria: mov.categoriaId,
      usuarioId: mov.usuarioId,
    },
  });

  if (!categoria) {
    throw { status: 403, message: "Categoria não pertence ao usuário." };
  }

  const updated = await MovimentacaoRepository.updateMovimentacao(id, mov);

  if (!updated) {
    throw { status: 404, message: "Movimentação não encontrada!" };
  }

  return updated;
}

export async function deleteMovimentacao(id, usuarioId) {
  if (!id || id <= 0) {
    throw { status: 400, message: "ID inválido!" };
  }

  const deleted = await MovimentacaoRepository.deleteMovimentacao(id, usuarioId);

  if (!deleted) {
    throw { status: 404, message: "Movimentação não encontrada!" };
  }

  return { message: "Movimentação removida com sucesso." };
}
