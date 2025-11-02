import { Movimentacao } from "../models/model.js";

async function createMovimentacao(movimentacao) {
    const movimentacao = Movimentacao.create({descricao: movimentacao.descricao, 
        valor: movimentacao.valor,
        data_movimentacao: movimentacao.data_movimentacao,
        transaction_type: transaction_type
    })
    return movimentacao;
}

async function listMovimentacaoByID(id){
    const movimentacao = await Movimentacao.findAll({
        where:{
            id_movimentacao: id
        }
    });
    return movimentacao;
}

async function updateMovimentacao(id, movimentacao) {
    const user = await Movimentacao.update(
        {nome: movimentacao.nome, tipo: movimentacao.tipo},
        {where: {id_movimentacao: id}}
    );
    return user;
}

async function deleteMovimentacao(id) {
    const user = await Movimentacao.destroy({
        where: {
            id_movimentacao: id
        }
    });
   return user; 
}

export {createMovimentacao, listMovimentacaoByID, updateMovimentacao, deleteMovimentacao};