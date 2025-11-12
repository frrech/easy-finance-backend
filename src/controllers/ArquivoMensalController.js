import * as ArquivoMensalService from "../services/ArquivoMensalService.js";

/**
 * Create a new monthly file and persist its record.
 * Expected body format:
 * {
 *   "id_usuario": 1,
 *   "usuario_nome": "Bernardo",
 *   "arquivo_mensal": {
 *      "creationDate": "2025-11-01T00:00:00Z",
 *      "saldo_final": 5230.50
 *   },
 *   "data_mes": "2025-11-01T00:00:00Z"
 * }
 */
async function createArquivoMensal(req, res) {
  try {
    const { id_usuario, usuario_nome, arquivo_mensal, data_mes } = req.body;

    if (!id_usuario || !usuario_nome || !arquivo_mensal || !data_mes) {
      return res.status(400).json({
        message:
          "Missing required fields: id_usuario, usuario_nome, arquivo_mensal, data_mes",
      });
    }

    const newArquivo = await ArquivoMensalService.createArquivoMensal(
      id_usuario,
      usuario_nome,
      arquivo_mensal,
      new Date(data_mes)
    );

    return res.status(201).json(newArquivo);
  } catch (err) {
    console.error("❌ Error creating Arquivo Mensal:", err);
    return res
      .status(err.status || 500)
      .json({ message: err.message || "Internal Server Error" });
  }
}

/**
 * List monthly file by its ID
 */
async function listArquivoByID(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const arquivo = await ArquivoMensalService.listArquivoByID(id);

    if (!arquivo) {
      return res.status(404).json({ message: "Arquivo mensal not found" });
    }

    return res.status(200).json(arquivo);
  } catch (err) {
    console.error("❌ Error listing Arquivo Mensal:", err);
    return res
      .status(err.status || 500)
      .json({ message: err.message || "Internal Server Error" });
  }
}

/**
 * Update a monthly file
 */
async function updateArquivoMensal(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    const arquivoData = req.body;

    const updated = await ArquivoMensalService.updateArquivoMensal(
      id,
      arquivoData
    );

    return res.status(200).json(updated);
  } catch (err) {
    console.error("❌ Error updating Arquivo Mensal:", err);
    return res
      .status(err.status || 500)
      .json({ message: err.message || "Internal Server Error" });
  }
}

/**
 * List all user files
  */

export const listArquivosByUsuario = async (req, res) => {
  try {
    const { usuario_id } = req.params;
    const arquivos = await ArquivoMensal.findAll({ where: { usuario_id } });

    if (!arquivos || arquivos.length === 0) {
      return res.status(404).json({ message: 'No files found for this user.' });
    }

    res.status(200).json(arquivos);
  } catch (error) {
    console.error('Error fetching user files:', error);
    res.status(500).json({ message: 'Server error fetching user files.' });
  }
};


/**
 * Delete a monthly file
 */
async function deleteArquivo(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    await ArquivoMensalService.deleteArquivo(id);
    return res.status(204).send();
  } catch (err) {
    console.error("❌ Error deleting Arquivo Mensal:", err);
    return res
      .status(err.status || 500)
      .json({ message: err.message || "Internal Server Error" });
  }
}

export {
  createArquivoMensal,
  listArquivoByID,
  updateArquivoMensal,
  deleteArquivo,
};
