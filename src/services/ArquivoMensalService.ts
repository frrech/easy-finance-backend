// src/services/ArquivoMensalService.ts
import { Op } from "sequelize";
import { Movimentacao, Categoria } from "../models/index.js";
import * as ArquivoRepo from "../repository/ArquivoMensalRepository.js";
// import { sequelize } from "../db/sequelize.js"; // if you keep a sequelize export

type Relatorio = {
  ano: number;
  mes: number;
  receitas: number;
  despesas: number;
  saldoMes: number;
  saldoAcumulado: number;
  porCategoria: Record<string, number>;
  movimentacoes: any[]; // raw movements with category info
};

function startOfMonth(ano: number, mes: number) {
  return new Date(ano, mes - 1, 1, 0, 0, 0, 0);
}
function endOfMonth(ano: number, mes: number) {
  return new Date(ano, mes, 0, 23, 59, 59, 999);
}

export async function listarArquivos(usuarioId: number) {
  const arquivos = await ArquivoRepo.listByUsuario(usuarioId);

  return arquivos.map((a: any) => {
    const rel = JSON.parse(a.conteudo);

    return {
      id: a.id,
      ano: a.ano,
      mes: a.mes,
      criadoEm: a.createdAt,
      atualizadoEm: a.updatedAt,

      // summary extracted from stored JSON
      receitas: rel.receitas,
      despesas: rel.despesas,
      saldoMes: rel.saldoMes,
      saldoAcumulado: rel.saldoAcumulado,
    };
  });
}

export async function gerarRelatorioMensal(usuarioId: number, ano: number, mes: number): Promise<Relatorio> {
  const inicio = startOfMonth(ano, mes);
  const fim = endOfMonth(ano, mes);

  // fetch movimentacoes in the month with category (use alias 'categoria' per your models)
  const movs = await Movimentacao.findAll({
    where: {
      usuarioId,
      dataMovimentacao: { [Op.between]: [inicio, fim] },
    },
    include: [
      {
        model: Categoria,
        as: "categoria",
        attributes: ["id", "nome", "tipo"],
      },
    ],
    order: [["dataMovimentacao", "ASC"]],
  });

  const movimentacoes = movs.map((m: any) => ({
    idMovimentacao: m.id,
    descricao: m.descricao,
    valor: Number(m.valor),
    dataMovimentacao: m.dataMovimentacao,
    tipo: m.tipo,
    categoria: m.categoria
      ? { idCategoria: m.categoria.id, nome: m.categoria.nome, tipo: m.categoria.tipo }
      : null,
  }));

  const receitas = movimentacoes
    .filter((m) => m.tipo === "entrada")
    .reduce((s, m) => s + Number(m.valor), 0);

  const despesas = movimentacoes
    .filter((m) => m.tipo === "saida")
    .reduce((s, m) => s + Number(m.valor), 0);

  const saldoMes = receitas - despesas;

  // saldo acumulado: sum of all movimentacoes up to the end of this month
  const acumInicio = new Date(0); // epoch
  const acumFim = endOfMonth(ano, mes);
  const allUntilMonth = await Movimentacao.findAll({
    where: {
      usuarioId,
      dataMovimentacao: { [Op.lte]: acumFim },
    },
  });

  const saldoAcumulado = allUntilMonth.reduce((s: number, m: any) => {
    const v = Number(m.valor);
    return s + (m.tipo === "entrada" ? v : -v);
  }, 0);

  // despesas por categoria in month
  const porCategoria = movimentacoes
    .filter((m) => m.tipo === "saida" && m.categoria)
    .reduce<Record<string, number>>((acc, mov) => {
      const nome = mov.categoria.nome;
      acc[nome] = (acc[nome] || 0) + Number(mov.valor);
      return acc;
    }, {});

  return {
    ano,
    mes,
    receitas,
    despesas,
    saldoMes,
    saldoAcumulado,
    porCategoria,
    movimentacoes,
  };
}

export async function gerarEArmazenar(usuarioId: number, ano: number, mes: number) {
  // If an existing report exists, update it (or keep it immutable and create new record — choose to upsert)
  const rel = await gerarRelatorioMensal(usuarioId, ano, mes);
  const conteudo = JSON.stringify(rel);

  // Use transaction to be safe
  const existing = await ArquivoRepo.findByUsuarioAnoMes(usuarioId, ano, mes);
  if (existing) {
    existing.conteudo = conteudo;
    existing.saldoAcumulado = rel.saldoAcumulado;
    await existing.save();
    return existing;
  }

  const created = await ArquivoRepo.createArquivoMensal({
    usuarioId,
    ano,
    mes,
    conteudo,
    saldoAcumulado: rel.saldoAcumulado,
  });

  return created;
}

export async function getRelatorio(usuarioId: number, ano: number, mes: number) {
  const rec = await ArquivoRepo.findByUsuarioAnoMes(usuarioId, ano, mes);
  if (!rec) return null;
  const parsed = JSON.parse(rec.conteudo);
  return { db: rec, relatorio: parsed };
}

// CSV builder: simple
export function relatorioToCSV(rel: Relatorio) {
  const rows: string[] = [];
  // header rows
  rows.push(`Relatório Mensal;${rel.ano}-${String(rel.mes).padStart(2, "0")}`);
  rows.push(`Receitas;${rel.receitas}`);
  rows.push(`Despesas;${rel.despesas}`);
  rows.push(`Saldo do mês;${rel.saldoMes}`);
  rows.push(`Saldo acumulado;${rel.saldoAcumulado}`);
  rows.push("");
  rows.push("Categoria;Valor");
  for (const [k, v] of Object.entries(rel.porCategoria)) {
    rows.push(`${k};${v}`);
  }
  rows.push("");
  rows.push("Data;Descrição;Tipo;Categoria;Valor");
  for (const m of rel.movimentacoes) {
    rows.push(
      `${new Date(m.dataMovimentacao).toLocaleDateString()}-${new Date(m.dataMovimentacao).toLocaleTimeString()};` +
        `${m.descricao};${m.tipo};${m.categoria?.nome ?? ""};${m.valor}`
    );
  }
  return rows.join("\n");
}
