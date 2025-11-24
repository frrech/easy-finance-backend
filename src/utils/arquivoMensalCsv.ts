// src/utils/arquivoMensalCsv.ts

export function relatorioToCSV(rel: any): string {
  let csv = "categoria,valor\n";

  for (const [cat, val] of Object.entries(rel.porCategoria || {})) {
    csv += `${cat},${val}\n`;
  }

  csv += `\nTotal Receitas,${rel.receitas}`;
  csv += `\nTotal Despesas,${rel.despesas}`;
  csv += `\nSaldo do Mês,${rel.saldoMes}`;
  csv += `\nSaldo Acumulado,${rel.saldoAcumulado}`;

  return csv;
}
