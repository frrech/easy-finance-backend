import { Arquivo_mensal, Movimentacao } from "../models/model.js";
import fs from "fs/promises";

async function createArquivoMensal(id_usuario, usuario_nome, arquivo_mensal, data_mes){
    const criarArquivoMensal = await Arquivo_mensal.create(
        {
            creationDate: arquivo_mensal.creationDate,
            saldo_final: arquivo_mensal.saldo_final,
            caminho_arquivo: generateFile(id_usuario, usuario_nome, data_mes)
        }
    )
}
//os arquivos serão gerados no primeiro de cada mês e vão pegar todas as movimentações do dia 1º ao dia final do mes
//portanto, data-mes sempre será gerado dia 1
async function generateFile(id_usuario, usuario_nome, data_mes){
    //atribuindo o dia primeiro do mes passado ao data_inicio
    const data_inicio = new Date((data_mes.getMonth() === 1) ? data_mes.getFullYear()-1 : data_mes.getFullYear(), (data_mes.getMonth() === 1) ? 12 : data_mes.getMonth()-1, 1)
    /**SELECT * FROM movimentacao WHERE id_usuario = id INNER JOIN usuario ON 
     * Movimentacao.id_usuario = Usuario.id_usuario AND data_movimentacao>=data_inicio_mes 
     * AND data_movimentacao<=data_final_mes
     **/
    const query = await Arquivo_mensal.findAll({
        raw:true,
        attributes: attributes,
        include: [{
            model: Movimentacao,
            required: true,
            attributes: attributes,
            where: {
                data_movimentacao: {
                    [Op.gte]: data_inicio,
                    [Op.lt]: data_mes
                }
            }
        }],
        order: [['id', 'ASC']]
    });
    try{
        //exemplo de arquivo: "../../user_files/1_Fulano de Tal/2025-11.txt"
        let fileHandle = await fs.open('../../user_files/'+id_usuario+"_"+usuario_nome+'/'+data_inicio.getFullYear()+'-'+data_inicio.getMonth()+'.txt', 'w');
        await fileHandle.write(query);
    } catch(err){
        console.error("Erro ao escrever o arquivo:", err);
    } finally{
        if(fileHandle){
            await fileHandle.close();
        }
    }
}

async function updateArquivoMensal(id, arquivo_mensal){
     const user = await Arquivo_mensal.update(
        {
            creationDate: arquivo_mensal.creationDate, 
            saldo_final: arquivo_mensal.saldo_final,
            caminho_arquivo: arquivo_mensal.caminho_arquivo
        },
        {
            where: {id_arquivo_mensal: id}
        }
    );
    return user;
}

async function listArquivoByID(id) {
    const arquivo_mensal = await Arquivo_mensal.findAll({
        where:{
            id_arquivo_mensal: id
        }
    });
    return arquivo_mensal;
}

async function deleteArquivo(id) {
    const a = await Arquivo_mensal.destroy({
        where: {
            id_arquivo_mensal: id
        }
    });
   return a;
}

export {createArquivoMensal, updateArquivoMensal, listArquivoByID, deleteArquivo};