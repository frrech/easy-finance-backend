import { Request, Response } from "express";
import * as ArquivoMensalService from "../services/ArquivoMensalService.js";
import { ArquivoMensal } from "../models/ArquivoMensal.js";

// ------------------------------
// CREATE
// ------------------------------
export async function createArquivoMensal(req: Request, res: Response) {
  try {
    const { usuario_id, usuario_nome, arquivo_mensal, data_mes } = req.body;

    if (!usuario_id || !usuario_nome || !arquivo_mensal || !data_mes) {
      return res.status(400).json({
        message:
          "Missing required fields: usuario_id, usuario_nome, arquivo_mensal, data_mes",
      });
    }

    const newArquivo = await ArquivoMensalService.createArquivoMensal(
      Number(usuario_id),
      usuario_nome,
      arquivo_mensal,
      new Date(data_mes)
    );

    return res.status(201).json(newArquivo);
  } catch (err: any) {
    console.error("❌ Error creating Arquivo Mensal:", err);
    return res
      .status(err?.status || 500)
      .json({ message: err?.message || "Internal Server Error" });
  }
}

// ------------------------------
// GET BY ID
// ------------------------------
export async function listArquivoByID(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);
    const arquivo = await ArquivoMensalService.listArquivoByID(id);

    return res.status(200).json(arquivo);
  } catch (err: any) {
    return res
      .status(err?.status || 500)
      .json({ message: err?.message || "Internal Server Error" });
  }
}

// ------------------------------
// LIST BY USER
// ------------------------------
export async function listArquivosByUsuario(req: Request, res: Response) {
  try {
    const usuarioId = Number(req.params.usuario_id);

    if (isNaN(usuarioId)) {
      return res.status(400).json({ message: "Invalid usuario_id" });
    }

    const arquivos = await ArquivoMensal.findAll({
      where: { usuarioId },
    });

    if (!arquivos || arquivos.length === 0) {
      return res.status(404).json({ message: "No files found for this user." });
    }

    return res.status(200).json(arquivos);
  } catch (err) {
    console.error("❌ Error fetching user files:", err);
    return res
      .status(500)
      .json({ message: "Server error fetching user files." });
  }
}

// ------------------------------
// UPDATE
// ------------------------------
export async function updateArquivoMensal(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    const updated = await ArquivoMensalService.updateArquivoMensal(id, req.body);

    return res.status(200).json(updated);
  } catch (err: any) {
    return res
      .status(err?.status || 500)
      .json({ message: err?.message || "Internal Server Error" });
  }
}

// ------------------------------
// DELETE
// ------------------------------
export async function deleteArquivo(req: Request, res: Response) {
  try {
    const id = Number(req.params.id);

    await ArquivoMensalService.deleteArquivo(id);

    return res.status(204).send();
  } catch (err: any) {
    return res
      .status(err?.status || 500)
      .json({ message: err?.message || "Internal Server Error" });
  }
}
