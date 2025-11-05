import * as arquivo_mensal_service from "..service/arquivo_mensal.service.js";

async function createArquivoMensal(req, res){
  try{
    const new_arquivo_mensal = await arquivo_mensal_service.createArquivoMensal(req.body.arquivo_mensal);
    res.status(201).json(new_arquivo_mensal)
  } catch (err){
    res.status(err.id || 500).json({message: err.msg || "Erro interno do servidor"});
  }
}

async function listArquivoByID(req, res){
  try{
    const id = parseInt(req.params.id);
    const arquivo_mensal = await arquivo_mensal_service.listArquivoByID(id);
    res.status(201).json(arquivo_mensal);
  } catch (err){
    res.status(err.id || 500).json({message: err.msg || "Erro interno do servidor"});
  }
}

async function updateArquivoMensal(req, res){
  try{
    const id = parseInt(req.params.id);
    const arquivo_mensal = req.body;
    const new_arquivo_mensal = await arquivo_mensal_service.updateArquivoMensal(id, arquivo_mensal);
    res.status(200).json(new_arquivo_mensal);
  } catch (err){
    res.status(err.id || 500).json({message: err.msg || "Erro interno do servidor"});
  }
}

async function deleteArquivo(req, res) {
  try{
    const id = parseInt(req.params.id);
    arquivo_mensal_service.deleteArquivo(id);
    res.status(204).send();
  } catch (err){
    res.status(err.id || 500).json({message: err.msg || "Erro interno do servidor"})
  }
}

export {createArquivoMensal, listArquivoByID, updateArquivoMensal, deleteArquivo};