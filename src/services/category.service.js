import * as category_repository from "../repository/category.repository.js";

function validateCategory(Category){
    return typeof Category.nome === 'string' && Category.nome.trim() !== '' &&
        typeof Category.tipo === 'string' && Category.tipo.trim() !== '' &&
        Category;

}

async function createCategory(Category){
    if(validateCategory()){
        return await category_repository.createCategory(Category);   
    }
    else{
        throw {id: 401, msg: "Campos vazios ou inválidos!"};
    }
}

async function listCategoryByID(id){
    if(!id || id < 0){
        throw {id: 401, msg: "ID inválido"};
    }
    const user = await category_repository.listCategoryByID(id);
    if(!c){
        throw {id: 404, msg: "A Categoria não foi encontrada"};
    }
    return user;
}

async function updateCategory(id, Category) {
    if(!id || id < 0){
        throw {id: 401, msg: "ID inválido"};
    }
    if(!validateCategory(Category)){
        throw {id: 401, msg: "Campos de categoria preenchidos incorretamente"};
    }
    return await category_repository.updateCategory(id, Category);
}

async function deleteCategory(id){
    if(!id || id < 0){
        throw {id: 401, msg: "ID inválido"};
    }
    const Category = await category_repository.deleteCategory(id);
    if(!Category){
        throw {id: 404, msg: "Categoria não encontrada"};
    }
    return Category;
}

export {createCategory, listCategoryByID, updateCategory, deleteCategory};