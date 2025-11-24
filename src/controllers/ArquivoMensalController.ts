// src/controllers/ArquivoMensalController.ts
import { Request, Response } from "express";
import * as ArquivoService from "../services/ArquivoMensalService.js";
import * as ArquivoMensalGeminiService from "../services/ArquivoMensalGeminiService.js";
import { generatePdfBuffer } from "../utils/arquivoMensalPdf.js";
import { relatorioToCSV } from "../utils/arquivoMensalCsv.js";

export async function gerarArquivoMensal(req: Request, res: Response) {
  try {
    const usuarioId = req.user.id;
    const ano = Number(req.query.ano);
    const mes = Number(req.query.mes);

    if (!ano || !mes) {
      return res.status(400).json({ message: "Ano e mês são obrigatórios" });
    }

    const created = await ArquivoService.gerarEArmazenar(usuarioId, ano, mes);
    return res.status(201).json(created);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message || "Erro interno" });
  }
}

export async function getArquivoMensal(req: Request, res: Response) {
  try {
    const usuarioId = req.user.id;
    const ano = Number(req.params.ano);
    const mes = Number(req.params.mes);

    const result = await ArquivoService.getRelatorio(usuarioId, ano, mes);
    if (!result) return res.status(404).json({ message: "Relatório não encontrado" });

    return res.status(200).json(result.relatorio);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message || "Erro interno" });
  }
}

export async function getAnaliseMensal(req: Request, res: Response) {
  try {
    const usuarioId = req.user.id;
    const arquivoId = Number(req.params.id);

    if (isNaN(arquivoId)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const result = await ArquivoMensalGeminiService.getAnaliseMensal(arquivoId, usuarioId);
    return res.status(200).json(result);
  } catch (err: any) {
    console.error(err);
    return res
      .status(err.status || 500)
      .json({ message: err.message || "Erro interno" });
  }
}

export async function listarArquivos(req: Request, res: Response) {
  try {
    const usuarioId = req.user.id;

    const list = await ArquivoService.listarArquivos(usuarioId);

    return res.status(200).json(list);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message || "Erro interno" });
  }
}

export async function downloadCsv(req: Request, res: Response) {
  try {
    const usuarioId = req.user.id;
    const ano = Number(req.params.ano);
    const mes = Number(req.params.mes);

    const r = await ArquivoService.getRelatorio(usuarioId, ano, mes);
    if (!r) return res.status(404).json({ message: "Relatório não encontrado" });

    const csv = relatorioToCSV(r.relatorio);
    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename=arquivo_mensal_${ano}_${mes}.csv`);
    res.send(csv);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message || "Erro interno" });
  }
}

export async function downloadPdf(req: Request, res: Response) {
  try {
    const usuarioId = req.user.id;
    const ano = Number(req.params.ano);
    const mes = Number(req.params.mes);

    const r = await ArquivoService.getRelatorio(usuarioId, ano, mes);
    if (!r) return res.status(404).json({ message: "Relatório não encontrado" });

    // generate PDF buffer using helper utility
    const buffer = await generatePdfBuffer(r.relatorio);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=arquivo_mensal_${ano}_${mes}.pdf`);
    res.send(buffer);
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message || "Erro interno" });
  }
}
