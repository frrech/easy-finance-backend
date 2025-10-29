import * as usuario_service from "../services/user.service.js";

async function createUsuario(req, res){
  try{
    const new_usuario = await usuario_service.createUsuario(req.body.usuario);
    res.status(201).json(new_usuario)
  } catch (err){
    res.status(err.id || 500).json({message: err.msg || "Erro interno do servidor"});
  }
}

async function listUsuarioByID(req, res){
  try{
    const id = parseInt(req.params.id);
    const usuario = await usuario_service.listUsuarioByID(id);
    res.status(201).json(usuario);
  } catch (err){
    res.status(err.id || 500).json({message: err.msg || "Erro interno do servidor"});
  }
}

async function updateUsuario(req, res){
  try{
    const id = parseInt(req.params.id);
    const usuario = req.body;
    const new_usuario = await usuario_service.updateUsuario(id, usuario);
    res.status(200).json(new_usuario);
  } catch (err){
    res.status(err.id || 500).json({message: err.msg || "Erro interno do servidor"});
  }
}

async function deleteUsuario(req, res) {
  try{
    const id = parseInt(req.params.id);
    usuario_service.deleteUsuario(id);
    res.status(204).send();
  } catch (err){
    res.status(err.id || 500).json({message: err.msg || "Erro interno do servidor"})
  }
}

export {createUsuario, listUsuarioByID, updateUsuario, deleteUsuario};