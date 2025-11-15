// controllers/MovimentacaoController.js
import * as MovimentacaoService from "../services/MovimentacaoService.js";

export async function createMovimentacao(req, res) {
  try {
    const usuarioId = req.user.usuarioID;

    const payload = {
      ...req.body,
      usuarioId, // always override from JWT
    };

    const mov = await MovimentacaoService.createMovimentacao(payload);
    return res.status(201).json(mov);
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "Erro interno do servidor",
    });
  }
}

export async function listMovimentacaoByID(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const mov = await MovimentacaoService.listMovimentacaoByID(id);
    return res.status(200).json(mov);
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "Erro interno do servidor",
    });
  }
}

export async function listMovimentacoesByUsuario(req, res) {
  try {
    const usuarioId = parseInt(req.params.usuario_id, 10);
    const movs = await MovimentacaoService.listMovimentacoesByUsuario(usuarioId);
    return res.status(200).json(movs);
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "Erro interno do servidor",
    });
  }
}

export async function updateMovimentacao(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const usuarioId = req.user.usuarioID;

    const payload = {
      ...req.body,
      usuarioId, // force ownership
    };

    const updated = await MovimentacaoService.updateMovimentacao(id, payload);
    return res.status(200).json(updated);
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "Erro interno do servidor",
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
      message: err.message || "Erro interno do servidor",
    });
  }
}
