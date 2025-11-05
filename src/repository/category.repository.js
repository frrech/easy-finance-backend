import { Categoria } from "../models/model.js";

async function createCategoria(categoria) {
    const user = await Categoria.create({nome: categoria.nome, tipo: categoria.tipo});
    return user;
}

// async function listAllCategorias() {
//     const Categorias = await Categoria.findAll();
//     return Categorias.every(user => user instanceof Categoria);
// }

async function listCategoriaByID(id){
    const Categoria = await Categoria.findAll({
        where:{
            id_categoria: id
        }
    });
    return Categoria;
}

async function updateCategoria(id, categoria) {
    const user = await Categoria.update(
        {nome: categoria.nome, tipo: categoria.tipo},
        {where: {id_categoria: id}}
    );
    return user;
}

async function deleteCategoria(id) {
    const c = await Categoria.destroy({
        where: {
            id_categoria: id
        }
    });
   return c; 
}

export {createCategoria, listCategoriaByID, updateCategoria, deleteCategoria};