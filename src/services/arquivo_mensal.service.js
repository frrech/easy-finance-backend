import arquivo_mensal_repository from "../repository/arquivo_mensal.repository.js"

function validateArquivo_mensal(arq){
    return !arq.creationDate.isNaN() && typeof arq.saldo_final === "number" &&
    arq.saldo_final.isFinite() && typeof arq.caminho_arquivo === "string" &&
    arq.caminho_arquivo.trim() === "";
}

async function createArquivoMensal(arq){
    if(validateMovimentacao(movimentacao)){
        return await movimentacao_repository.createMovimentacao(movimentacao);
    }
    else{
        throw {id: 401, msg: "Campos vazios ou inválidos!"};
    }
}

async function updateArquivoMensal(id, arquivo_mensal){
    if(!id || id < 0){
        throw {id: 401, msg: "ID inválido"};
    }
    if(!validateArquivo_mensal(arquivo_mensal)){
        throw {id: 401, msg: "Campos preenchidos incorretamente"};
    }
    return await arquivo_mensal_repository.updateMovimentacao(id, movimentacao);
}

async function listArquivoByID(params) {
    if(typeof id !== "number" || id<0){
        throw {id: 401, msg: "ID inválido!"};
    }
    const mov = await listArquivoByID(id);
    if(!mov){
        throw {id: 404, msg: "Arquivo não encontrado!"};
    }
    return mov;    
}

async function deleteArquivo(id) {
    if(!id || id < 0){
        throw {id: 401, msg: "ID inválido"};
    }
    const arq = await arquivo_mensal_repository.deleteArquivo(id);
    if(!arq){
        throw {id: 404, msg: "Arquivo não encontrado"};
    }
    return arq;
}

export {createArquivoMensal, updateArquivoMensal, listArquivoByID, deleteArquivo};