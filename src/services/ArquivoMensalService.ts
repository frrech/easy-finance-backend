import * as ArquivoMensalRepository from "../repository/ArquivoMensalRepository";

interface ArquivoMensalDTO {
  creationDate: string | Date;
  saldoFinal: number;
}

function validateArquivoMensal(arq: ArquivoMensalDTO) {
  if (!arq) return false;
  const validDate = !isNaN(new Date(arq.creationDate).getTime());
  const validSaldo = typeof arq.saldoFinal === "number";
  return validDate && validSaldo;
}

export async function createArquivoMensal(
  usuarioId: number,
  usuarioNome: string,
  arquivoMensal: ArquivoMensalDTO,
  dataMes: Date
) {
  if (!validateArquivoMensal(arquivoMensal)) {
    throw { status: 400, message: "Invalid arquivo_mensal data" };
  }

  return ArquivoMensalRepository.createArquivoMensal(
    usuarioId,
    usuarioNome,
    arquivoMensal,
    dataMes
  );
}

export async function updateArquivoMensal(
  id: number,
  arquivoMensal: ArquivoMensalDTO
) {
  if (!validateArquivoMensal(arquivoMensal)) {
    throw { status: 400, message: "Invalid arquivo_mensal data" };
  }

  const updated = await ArquivoMensalRepository.updateArquivoMensal(
    id,
    arquivoMensal
  );

  if (!updated) {
    throw { status: 404, message: "Arquivo Mensal not found" };
  }

  return updated;
}

export async function listArquivoByID(id: number) {
  const arquivo = await ArquivoMensalRepository.listArquivoByID(id);
  if (!arquivo) throw { status: 404, message: "Arquivo Mensal not found" };
  return arquivo;
}

export async function deleteArquivo(id: number) {
  const deleted = await ArquivoMensalRepository.deleteArquivo(id);
  if (!deleted) throw { status: 404, message: "Arquivo Mensal not found" };
  return deleted;
}
