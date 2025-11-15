import { ArquivoMensal, Movimentacao } from "../models/model.js";
import fs from "fs/promises";
import path from "path";
import { Op } from "sequelize";

async function createArquivoMensal(usuarioID, usuarioNome, arquivoMensal, dataMes) {
  try {
    // Generate the file first
    const caminhoArquivo = await generateFile(usuarioID, usuarioNome, dataMes);

    // Then persist the record
    const novoArquivo = await ArquivoMensal.create({
      creationDate: arquivoMensal.creationDate,
      saldo_final: arquivoMensal.saldo_final,
      caminho_arquivo: caminhoArquivo,
      usuariousuarioID: usuarioID, // adjust foreign key to match your model
    });

    return novoArquivo;
  } catch (err) {
    console.error("❌ Error creating Arquivo Mensal:", err);
    throw err;
  }
}

// Generate the monthly file containing the user's transactions
async function generateFile(usuarioID, usuarioNome, dataMes) {
  try {
    const mesAtual = dataMes.getMonth();
    const anoAtual = dataMes.getFullYear();
    const dataInicio = new Date(anoAtual, mesAtual - 1, 1);
    const dataFim = new Date(anoAtual, mesAtual, 0, 23, 59, 59);

    // Fetch all transactions of that user for that period
    const movimentacoes = await Movimentacao.findAll({
      where: {
        usuariousuarioID: usuarioID,
        data_movimentacao: {
          [Op.between]: [dataInicio, dataFim],
        },
      },
      order: [["data_movimentacao", "ASC"]],
      raw: true,
    });

    // Build directory path
    const dir = path.join("user_files", `${usuarioID}_${usuarioNome}`);
    await fs.mkdir(dir, { recursive: true });

    // File name: e.g., "2025-10.txt"
    const fileName = `${dataInicio.getFullYear()}-${String(dataInicio.getMonth() + 1).padStart(2, "0")}.txt`;
    const filePath = path.join(dir, fileName);

    // Prepare content
    const content = movimentacoes.map(m => {
      return `${m.data_movimentacao.toISOString()} | ${m.transaction_type} | ${m.descricao || ""} | R$ ${m.valor}`;
    }).join("\n");

    await fs.writeFile(filePath, content, "utf-8");

    console.log(`📄 Arquivo mensal criado: ${filePath}`);
    return filePath;
  } catch (err) {
    console.error("❌ Error generating monthly file:", err);
    throw err;
  }
}

async function updateArquivoMensal(id, arquivoMensal) {
  try {
    const [updated] = await ArquivoMensal.update(
      {
        creationDate: arquivoMensal.creationDate,
        saldo_final: arquivoMensal.saldo_final,
        caminho_arquivo: arquivoMensal.caminho_arquivo,
      },
      { where: { idArquivoMensal: id } }
    );
    return updated;
  } catch (err) {
    console.error("❌ Error updating Arquivo Mensal:", err);
    throw err;
  }
}

async function listArquivoByID(id) {
  try {
    const arquivo = await ArquivoMensal.findByPk(id);
    return arquivo;
  } catch (err) {
    console.error("❌ Error listing Arquivo Mensal by ID:", err);
    throw err;
  }
}

async function deleteArquivo(id) {
  try {
    const deleted = await ArquivoMensal.destroy({ where: { idArquivoMensal: id } });
    return deleted;
  } catch (err) {
    console.error("❌ Error deleting Arquivo Mensal:", err);
    throw err;
  }
}

export {
  createArquivoMensal,
  updateArquivoMensal,
  listArquivoByID,
  deleteArquivo,
};
