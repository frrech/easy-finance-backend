import * as usuario_repository from "../repository/usuario.repository.js";
function validateUsuario(usuario){
    return typeof usuario.nome === 'string' && usuario.nome.trim() !== '' &&
        typeof usuario.email === 'string' && usuario.email.trim() !== '' &&
        typeof usuario.senha === 'string' && usuario.senha.trim() !== '' &&
        usuario;

}

async function createUsuario(usuario){
    if(validateUsuario()){
        return await usuario_repository.createUsuario(usuario);   
    }
    else{
        throw {id: 401, msg: "Campos vazios ou inválidos!"};
    }
}

async function listUsuarioByID(id){
    if(!id || id < 0){
        throw {id: 401, msg: "ID inválido"};
    }
    const user = await usuario_repository.listUsuarioByID(id);
    if(!c){
        throw {id: 404, msg: "O Usuário não foi encontrado"};
    }
    return user;
}

async function updateUsuario(id, usuario) {
    if(!id || id < 0){
        throw {id: 401, msg: "ID inválido"};
    }
    if(!validateUsuario(usuario)){
        throw {id: 401, msg: "Campos de usuário preenchidos incorretamente"};
    }
    return await usuario_repository.updateUsuario(id, usuario);
}

async function deleteUsuario(id){
    if(!id || id < 0){
        throw {id: 401, msg: "ID inválido"};
    }
    const usuario = await usuario_repository.deleteUsuario(id);
    if(!usuario){
        throw {id: 404, msg: "Usuário não encontrado"};
    }
    return usuario;
}

export {createUsuario, listUsuarioByID, updateUsuario, deleteUsuario};