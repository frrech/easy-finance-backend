import * as MovimentacaoService from "../services/MovimentacaoService.js";

export async function createMovimentacao(req, res) {
  try {
    const newMovimentacao = await MovimentacaoService.createMovimentacao(req.body);
    return res.status(201).json(newMovimentacao);
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "Erro interno do servidor"
    });
  }
}

export async function listMovimentacaoByID(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const movimentacao = await MovimentacaoService.listMovimentacaoByID(id);
    return res.status(200).json(movimentacao);
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "Erro interno do servidor"
    });
  }
}

export async function updateMovimentacao(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const movimentacao = req.body;
    const updatedMovimentacao = await MovimentacaoService.updateMovimentacao(id, movimentacao);
    return res.status(200).json(updatedMovimentacao);
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "Erro interno do servidor"
    });
  }
}

export async function deleteMovimentacao(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    await MovimentacaoService.deleteMovimentacao(id);
    return res.status(204).send();
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "Erro interno do servidor"
    });
  }
}

export async function listMovimentacoesByUsuario(req, res) {
  try {
    const usuario_id = parseInt(req.params.usuario_id, 10);
    const movimentacoes = await MovimentacaoService.listMovimentacoesByUsuario(usuario_id);
    return res.status(200).json(movimentacoes);
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "Erro interno do servidor"
    });
  }
}
