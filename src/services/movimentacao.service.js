import movimentacao_repository from "../repository/movimentacao.repository.js";

function validateMovimentacao(movimentacao){
    return typeof movimentacao.descricao === "string" && movimentacao.descricao.trim() === '' &&
           typeof movimentacao.valor === "number" && movimentacao.valor.isFinite() &&
           movimentacao.transaction_type === "string" && movimentacao.transaction_type.trim() === '' &&
           movimentacao.data_movimentacao && movimentacao;
}

async function createMovimentacao(movimentacao) {
    if(validateMovimentacao(movimentacao)){
        return await movimentacao_repository.createMovimentacao(movimentacao);
    }
    else{
        throw {id: 401, msg: "Campos vazios ou inválidos!"};
    }
}

async function listMovimentacaoByID(id){
    if(typeof id !== "number" || id<0){
        throw {id: 401, msg: "ID inválido!"};
    }
    const mov = await listMovimentacaoByID(id);
    if(!mov){
        throw {id: 404, msg: "Movimentação não encontrada!"};
    }
    return mov;
}

async function updateMovimentacao(id, movimentacao) {
    if(!id || id < 0){
        throw {id: 401, msg: "ID inválido"};
    }
    if(!validateMovimentacao(movimentacao)){
        throw {id: 401, msg: "Campos de movimentação preenchidos incorretamente"};
    }
    return await movimentacao_repository.updateMovimentacao(id, movimentacao);
}

async function deleteMovimentacao(id){
    if(!id || id < 0){
        throw {id: 401, msg: "ID inválido"};
    }
    const movimentacao = await movimentacao_repository.deleteMovimentacao(id);
    if(!movimentacao){
        throw {id: 404, msg: "Movimentação não encontrada"};
    }
    return movimentacao;
}

export {createMovimentacao, listMovimentacaoByID, updateMovimentacao, deleteMovimentacao};