import * as movimentacao_service from "..service/movimentacao.service.js";

async function createMovimentacao(req, res){
  try{
    const new_Movimentacao = await movimentacao_service.createMovimentacao(req.body.Movimentacao);
    res.status(201).json(new_Movimentacao)
  } catch (err){
    res.status(err.id || 500).json({message: err.msg || "Erro interno do servidor"});
  }
}

async function listMovimentacaoByID(req, res){
  try{
    const id = parseInt(req.params.id);
    const Movimentacao = await movimentacao_service.listMovimentacaoByID(id);
    res.status(201).json(Movimentacao);
  } catch (err){
    res.status(err.id || 500).json({message: err.msg || "Erro interno do servidor"});
  }
}

async function updateMovimentacao(req, res){
  try{
    const id = parseInt(req.params.id);
    const Movimentacao = req.body;
    const new_Movimentacao = await movimentacao_service.updateMovimentacao(id, Movimentacao);
    res.status(200).json(new_Movimentacao);
  } catch (err){
    res.status(err.id || 500).json({message: err.msg || "Erro interno do servidor"});
  }
}

async function deleteMovimentacao(req, res) {
  try{
    const id = parseInt(req.params.id);
    movimentacao_service.deleteMovimentacao(id);
    res.status(204).send();
  } catch (err){
    res.status(err.id || 500).json({message: err.msg || "Erro interno do servidor"})
  }
}

export {createMovimentacao, listMovimentacaoByID, updateMovimentacao, deleteMovimentacao};