// src/services/ArquivoMensalGeminiService.ts
import * as ArquivoRepo from "../repository/ArquivoMensalRepository.js";
import { geminiService } from "./GeminiService.js";
import { gerarRelatorioMensal } from "./ArquivoMensalService.js";

export async function getAnaliseMensal(arquivoId: number, usuarioId: number) {
  // 1. Load the stored monthly report
  const arquivoAtual = await ArquivoRepo.getById(arquivoId);

  if (!arquivoAtual || arquivoAtual.usuarioId !== usuarioId) {
    throw { status: 404, message: "Arquivo Mensal não encontrado ou acesso negado" };
  }

  const relAtual = JSON.parse(arquivoAtual.conteudo);
  const ano = relAtual.ano;
  const mes = relAtual.mes;

  // 2. Load previous month’s report (if exists)
  const prevMes = mes === 1 ? 12 : mes - 1;
  const prevAno = mes === 1 ? ano - 1 : ano;

  const arquivoAnterior = await ArquivoRepo.findByUsuarioAnoMes(
    usuarioId,
    prevAno,
    prevMes
  );

  let relAnterior = null;

  if (arquivoAnterior) {
    relAnterior = JSON.parse(arquivoAnterior.conteudo);
  } else {
    // Generate on-the-fly (no DB write)
    relAnterior = await gerarRelatorioMensal(usuarioId, prevAno, prevMes);
  }

  // 3. Prepare category comparison
  const gastosAtuais = relAtual.porCategoria || {};
  const gastosAnteriores = relAnterior.porCategoria || {};

  const allCats = new Set([
    ...Object.keys(gastosAtuais),
    ...Object.keys(gastosAnteriores),
  ]);

  const variacaoPercentual: Record<string, string> = {};

  allCats.forEach((cat) => {
    const atual = gastosAtuais[cat] || 0;
    const anterior = gastosAnteriores[cat] || 0;

    if (anterior > 0) {
      const v = ((atual - anterior) / anterior) * 100;
      variacaoPercentual[cat] = `${v.toFixed(2)}%`;
    } else if (atual > 0) {
      variacaoPercentual[cat] = "Novo gasto";
    } else {
      variacaoPercentual[cat] = "0.00%";
    }
  });

  // 4. Build Gemini prompt
  const prompt = `
# 📊 Análise Financeira Mensal (${mes}/${ano})

## Dados do Mês Atual
- Receitas: R$ ${relAtual.receitas.toFixed(2)}
- Despesas: R$ ${relAtual.despesas.toFixed(2)}
- Saldo do mês: R$ ${relAtual.saldoMes.toFixed(2)}
- Saldo acumulado: R$ ${relAtual.saldoAcumulado.toFixed(2)}

### Gastos por categoria:
${JSON.stringify(gastosAtuais, null, 2)}

## Mês Anterior (${prevMes}/${prevAno})
### Gastos por categoria:
${JSON.stringify(gastosAnteriores, null, 2)}

## Variação percentual:
${JSON.stringify(variacaoPercentual, null, 2)}

---

## 🎯 Sua Tarefa
1. Resumo geral
2. Destaque a maior variação
3. Outras variações relevantes
4. Recomendações práticas

Responda em Markdown.
`;

  // 5. Gemini call
  const analise = await geminiService.generateAnalysis(prompt);

  return { analise };
}
