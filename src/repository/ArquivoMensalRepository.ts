// src/repository/ArquivoMensalRepository.ts
import { ArquivoMensal } from "../models/ArquivoMensal.js";

export async function createArquivoMensal(payload: {
  usuarioId: number;
  ano: number;
  mes: number;
  conteudo: string;
  saldoAcumulado?: number | null;
}) {
  return ArquivoMensal.create({
    usuarioId: payload.usuarioId,
    ano: payload.ano,
    mes: payload.mes,
    conteudo: payload.conteudo,
    saldoAcumulado: payload.saldoAcumulado ?? null,
  });
}

/** Get report by ID */
export async function getById(id: number) {
  return ArquivoMensal.findByPk(id);
}

/** Get a report for a specific user/month */
export async function findByUsuarioAnoMes(
  usuarioId: number,
  ano: number,
  mes: number
) {
  return ArquivoMensal.findOne({
    where: { usuarioId, ano, mes },
  });
}

/** Get a report by ano/mes regardless of user (rarely used) */
export async function getByAnoMes(ano: number, mes: number) {
  return ArquivoMensal.findOne({
    where: { ano, mes },
  });
}

/** List all reports from a user */
export async function listByUsuario(usuarioId: number) {
  return ArquivoMensal.findAll({
    where: { usuarioId },
    order: [
      ["ano", "DESC"],
      ["mes", "DESC"],
    ],
  });
}


/** Update a report */
export async function updateArquivoMensal(
  id: number,
  data: Partial<{
    conteudo: string;
    saldoAcumulado: number | null;
  }>
) {
  const [updated] = await ArquivoMensal.update(data, {
    where: { id },
  });

  if (updated === 0) return null;

  return ArquivoMensal.findByPk(id);
}

/** Delete a report */
export async function deleteArquivo(id: number) {
  const deleted = await ArquivoMensal.destroy({
    where: { id },
  });

  return deleted > 0;
}
