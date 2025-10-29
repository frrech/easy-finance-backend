import { Usuario } from "../models/model.js";

async function createUsuario(usuario) {
    const user = await Usuario.create({nome: usuario.nome, email: usuario.email, senha: usuario.senha});
    return user;
}

// async function listAllUsuarios() {
//     const usuarios = await Usuario.findAll();
//     return usuarios.every(user => user instanceof Usuario);
// }

async function listUsuarioByID(id){
    const usuario = await Usuario.findAll({
        where:{
            id_usuario: id
        }
    });
    return usuario;
}

async function updateUsuario(id, usuario) {
    const user = await Usuario.update(
        {nome: usuario.nome, email: usuario.email, senha: usuario.senha},
        {where: {id_usuario: id}}
    );
    return user;
}

async function deleteUsuario(id) {
    const user = await Usuario.destroy({
        where: {
            id_usuario: id
        }
    });
   return user; 
}

export {createUsuario, listUsuarioByID, updateUsuario, deleteUsuario};