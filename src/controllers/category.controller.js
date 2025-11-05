import * as category_service from "..service/category.service.js";

async function createCategoria(req, res){
  try{
    const new_Categoria = await Categoria_service.createCategoria(req.body.Categoria);
    res.status(201).json(new_Categoria)
  } catch (err){
    res.status(err.id || 500).json({message: err.msg || "Erro interno do servidor"});
  }
}

async function listCategoriaByID(req, res){
  try{
    const id = parseInt(req.params.id);
    const Categoria = await Categoria_service.listCategoriaByID(id);
    res.status(201).json(Categoria);
  } catch (err){
    res.status(err.id || 500).json({message: err.msg || "Erro interno do servidor"});
  }
}

async function updateCategoria(req, res){
  try{
    const id = parseInt(req.params.id);
    const Categoria = req.body;
    const new_Categoria = await Categoria_service.updateCategoria(id, Categoria);
    res.status(200).json(new_Categoria);
  } catch (err){
    res.status(err.id || 500).json({message: err.msg || "Erro interno do servidor"});
  }
}

async function deleteCategoria(req, res) {
  try{
    const id = parseInt(req.params.id);
    Categoria_service.deleteCategoria(id);
    res.status(204).send();
  } catch (err){
    res.status(err.id || 500).json({message: err.msg || "Erro interno do servidor"})
  }
}

export {createCategoria, listCategoriaByID, updateCategoria, deleteCategoria};