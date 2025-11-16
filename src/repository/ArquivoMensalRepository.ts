import { ArquivoMensal, ArquivoMensalAttributes, Movimentacao } from "../models/model.js";
import fs from "fs/promises";
import path from "path";
import { Op } from "sequelize";

export async function createArquivoMensal(
  usuarioId: number,
  usuarioNome: string,
  arquivoMensal: { creationDate: string | Date; saldoFinal: number },
  dataMes: Date
) {
  const caminhoArquivo = await generateFile(usuarioId, usuarioNome, dataMes);

  return ArquivoMensal.create({
    creationDate: new Date(arquivoMensal.creationDate),
    saldoFinal: arquivoMensal.saldoFinal,
    caminhoArquivo,
    usuarioId,
    mes: dataMes.getMonth() + 1,
    ano: dataMes.getFullYear(),
  });
}

interface ArquivoMensalUpdateDTO {
  creationDate?: string | Date;
  saldoFinal?: number;
  caminhoArquivo?: string | null;
}

async function generateFile(
  usuarioId: number,
  usuarioNome: string,
  dataMes: Date
) {
  try {
    const mes = dataMes.getMonth();
    const ano = dataMes.getFullYear();

    const dataInicio = new Date(ano, mes, 1);
    const dataFim = new Date(ano, mes + 1, 0, 23, 59, 59);

    const movimentacoes = await Movimentacao.findAll({
      where: {
        usuarioId,
        dataMovimentacao: {
          [Op.between]: [dataInicio, dataFim],
        },
      },
      order: [["dataMovimentacao", "ASC"]],
      raw: true,
    });

    const dir = path.join("user_files", `${usuarioId}_${usuarioNome}`);
    await fs.mkdir(dir, { recursive: true });

    const fileName = `${ano}-${String(mes + 1).padStart(2, "0")}.txt`;
    const filePath = path.join(dir, fileName);

    const content = movimentacoes
      .map((m) => {
        return `${m.dataMovimentacao} | ${m.tipo} | ${m.descricao || ""} | R$ ${
          m.valor
        }`;
      })
      .join("\n");

    await fs.writeFile(filePath, content, "utf-8");

    console.log("📄 Arquivo mensal criado:", filePath);
    return filePath;
  } catch (err) {
    console.error("❌ Error generating monthly file:", err);
    throw err;
  }
}

export async function updateArquivoMensal(
  id: number,
  data: ArquivoMensalUpdateDTO
) {
  try {
    const [updated] = await ArquivoMensal.update(
      {
        creationDate: data.creationDate
          ? new Date(data.creationDate)
          : undefined,
        saldoFinal: data.saldoFinal,
        caminhoArquivo: data.caminhoArquivo,
      },
      { where: { idArquivoMensal: id } }
    );

    return updated;
  } catch (err) {
    console.error("❌ Error updating Arquivo Mensal:", err);
    throw err;
  }
}


export async function listArquivoByID(id: number) {
  return await ArquivoMensal.findByPk(id);
}

export async function deleteArquivo(id: number) {
  return await ArquivoMensal.destroy({ where: { idArquivoMensal: id } });
}
