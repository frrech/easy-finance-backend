// src/services/ArquivoMensalGeminiService.ts
import * as ArquivoRepo from "../repository/ArquivoMensalRepository.js";
import { geminiService } from "./GeminiService.js";
import { gerarRelatorioMensal } from "./ArquivoMensalService.js";

// --------------------------------------------------------
// 🔧 Internal helper: Load current + previous reports
// --------------------------------------------------------
async function loadRelatorios(arquivoId: number, usuarioId: number) {
  const arquivoAtual = await ArquivoRepo.getById(arquivoId);

  if (!arquivoAtual || arquivoAtual.usuarioId !== usuarioId) {
    throw { status: 404, message: "Arquivo Mensal não encontrado ou acesso negado" };
  }

  const relAtual = JSON.parse(arquivoAtual.conteudo);
  const ano = relAtual.ano;
  const mes = relAtual.mes;

  const prevMes = mes === 1 ? 12 : mes - 1;
  const prevAno = mes === 1 ? ano - 1 : ano;

  const arquivoAnterior = await ArquivoRepo.findByUsuarioAnoMes(
    usuarioId,
    prevAno,
    prevMes
  );

  const relAnterior = arquivoAnterior
    ? JSON.parse(arquivoAnterior.conteudo)
    : await gerarRelatorioMensal(usuarioId, prevAno, prevMes); // generated on the fly

  return {
    arquivoAtual,
    relAtual,
    relAnterior,
    ano,
    mes,
    prevAno,
    prevMes,
  };
}

// --------------------------------------------------------
// 🔧 Internal helper: Build structured & consistent prompt
// --------------------------------------------------------
function buildPrompt(
  relAtual: any,
  relAnterior: any,
  ano: number,
  mes: number,
  prevAno: number,
  prevMes: number
) {
  const gastosAtuais = relAtual.porCategoria || {};
  const gastosAnteriores = relAnterior.porCategoria || {};

  const allCats = new Set([
    ...Object.keys(gastosAtuais),
    ...Object.keys(gastosAnteriores),
  ]);

  const variacao: Record<string, string> = {};

  allCats.forEach((cat) => {
    const atual = gastosAtuais[cat] ?? 0;
    const anterior = gastosAnteriores[cat] ?? 0;

    if (anterior > 0) {
      const v = ((atual - anterior) / anterior) * 100;
      variacao[cat] = `${v.toFixed(2)}%`;
    } else if (atual > 0) {
      variacao[cat] = "Novo gasto";
    } else {
      variacao[cat] = "0.00%";
    }
  });

  return `
# 📊 Análise Financeira Mensal (${mes}/${ano})

## Dados do Mês Atual
- Receitas: R$ ${relAtual.receitas.toFixed(2)}
- Despesas: R$ ${relAtual.despesas.toFixed(2)}
- Saldo do mês: R$ ${relAtual.saldoMes.toFixed(2)}
- Saldo acumulado: R$ ${relAtual.saldoAcumulado.toFixed(2)}

### Gastos por categoria:
${JSON.stringify(gastosAtuais, null, 2)}

---

## Mês Anterior (${prevMes}/${prevAno})

### Gastos por categoria:
${JSON.stringify(gastosAnteriores, null, 2)}

---

## Variação percentual por categoria:
${JSON.stringify(variacao, null, 2)}

---

## 🎯 Sua Tarefa
1. Resumo geral das finanças
2. Destaque a maior variação significativa
3. Aponte outras mudanças importantes
4. Dê recomendações práticas para otimização financeira

Responda em Markdown.
`;
}

// --------------------------------------------------------
// 🧠 GET — Cached version (preferred)
// --------------------------------------------------------
export async function getAnaliseMensal(arquivoId: number, usuarioId: number) {
  const { arquivoAtual, relAtual, relAnterior, ano, mes, prevAno, prevMes } =
    await loadRelatorios(arquivoId, usuarioId);

  // If already cached — return immediately
  if (arquivoAtual.analysis && arquivoAtual.analysis.trim().length > 0) {
    return { analise: arquivoAtual.analysis, cached: true };
  }

  // Build AI prompt
  const prompt = buildPrompt(relAtual, relAnterior, ano, mes, prevAno, prevMes);

  // Call Gemini
  const analise = await geminiService.generateAnalysis(prompt);

  // Store in DB
  await ArquivoRepo.storeAnalysis(arquivoId, analise);

  return { analise, cached: false };
}

// --------------------------------------------------------
// 🔄 POST — Force regeneration
// --------------------------------------------------------
export async function regenerateAnalise(arquivoId: number, usuarioId: number) {
  const { arquivoAtual, relAtual, relAnterior, ano, mes, prevAno, prevMes } =
    await loadRelatorios(arquivoId, usuarioId);

  const prompt = buildPrompt(relAtual, relAnterior, ano, mes, prevAno, prevMes);

  // Always fresh generation
  const analise = await geminiService.generateAnalysis(prompt);

  // Store updated version
  await ArquivoRepo.storeAnalysis(arquivoId, analise);

  return { analise, regenerated: true };
}
