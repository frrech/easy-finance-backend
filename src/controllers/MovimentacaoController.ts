import * as MovimentacaoService from "../services/MovimentacaoService.js";

export async function createMovimentacao(req, res) {
  try {
    const usuarioId = req.user.usuarioID;

    const payload = {
      ...req.body,
      usuarioId,
      dataMovimentacao: req.body.dataMovimentacao || req.body.data_movimentacao,
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
    const id = Number(req.params.id);
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
    const usuarioId = Number(req.params.usuario_id);

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
    const id = Number(req.params.id);
    const usuarioId = req.user.usuarioID;

    const payload = {
      ...req.body,
      usuarioId,
      dataMovimentacao: req.body.dataMovimentacao || req.body.data_movimentacao,
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
    const id = Number(req.params.id);
    const usuarioId = req.user.usuarioID;

    await MovimentacaoService.deleteMovimentacao(id, usuarioId);

    return res.status(204).send();
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "Erro interno do servidor",
    });
  }
}
