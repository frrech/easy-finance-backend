import * as ArquivoMensalRepository from "../repository/ArquivoMensalRepository.js";

/**
 * Validate Arquivo_mensal object
 */
function validateArquivoMensal(arq) {
  if (!arq) return false;

  const validDate = arq.creationDate && !isNaN(new Date(arq.creationDate));
  const validSaldo =
    typeof arq.saldo_final === "number" && isFinite(arq.saldo_final);

  return validDate && validSaldo;
}

/**
 * Create Arquivo Mensal — wrapper for repository logic
 */
async function createArquivoMensal(id_usuario, usuario_nome, arquivo_mensal, data_mes) {
  if (!id_usuario || !usuario_nome || !arquivo_mensal || !data_mes) {
    throw { status: 400, message: "Missing required fields" };
  }

  if (!validateArquivoMensal(arquivo_mensal)) {
    throw { status: 400, message: "Invalid arquivo_mensal data" };
  }

  const created = await ArquivoMensalRepository.createArquivoMensal(
    id_usuario,
    usuario_nome,
    arquivo_mensal,
    data_mes
  );

  return created;
}

/**
 * Update Arquivo Mensal
 */
async function updateArquivoMensal(id, arquivo_mensal) {
  if (!id || id <= 0) {
    throw { status: 400, message: "Invalid ID" };
  }

  if (!validateArquivoMensal(arquivo_mensal)) {
    throw { status: 400, message: "Invalid arquivo_mensal data" };
  }

  const updated = await ArquivoMensalRepository.updateArquivoMensal(
    id,
    arquivo_mensal
  );

  if (!updated) {
    throw { status: 404, message: "Arquivo Mensal not found" };
  }

  return updated;
}

/**
 * Get Arquivo Mensal by ID
 */
async function listArquivoByID(id) {
  if (!id || id <= 0) {
    throw { status: 400, message: "Invalid ID" };
  }

  const arquivo = await ArquivoMensalRepository.listArquivoByID(id);

  if (!arquivo) {
    throw { status: 404, message: "Arquivo Mensal not found" };
  }

  return arquivo;
}

/**
 * Delete Arquivo Mensal
 */
async function deleteArquivo(id) {
  if (!id || id <= 0) {
    throw { status: 400, message: "Invalid ID" };
  }

  const deleted = await ArquivoMensalRepository.deleteArquivo(id);

  if (!deleted) {
    throw { status: 404, message: "Arquivo Mensal not found" };
  }

  return deleted;
}

export {
  createArquivoMensal,
  updateArquivoMensal,
  listArquivoByID,
  deleteArquivo,
};
