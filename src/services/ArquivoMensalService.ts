import * as ArquivoMensalRepository from "../repository/ArquivoMensalRepository.js";
import { geminiService } from "./GeminiService.js";
import { findMovimentacoesByDateRange } from "../repository/MovimentacaoRepository.js";

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
  dataMes: Date,
) {
  if (!validateArquivoMensal(arquivoMensal)) {
    throw { status: 400, message: "Invalid arquivo_mensal data" };
  }

  return ArquivoMensalRepository.createArquivoMensal(
    usuarioId,
    usuarioNome,
    arquivoMensal,
    dataMes,
  );
}

export async function updateArquivoMensal(
  id: number,
  arquivoMensal: ArquivoMensalDTO,
) {
  if (!validateArquivoMensal(arquivoMensal)) {
    throw { status: 400, message: "Invalid arquivo_mensal data" };
  }

  const updated = await ArquivoMensalRepository.updateArquivoMensal(
    id,
    arquivoMensal,
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

export async function getAnaliseMensal(arquivoId: number, usuarioId: number) {
  // 1. Fetch current month's archive
  const arquivoAtual = await ArquivoMensalRepository.listArquivoByID(arquivoId);
  if (!arquivoAtual || arquivoAtual.usuarioId !== usuarioId) {
    throw { status: 404, message: "Arquivo Mensal not found or access denied" };
  }

  // 2. Define date ranges
  const ano = arquivoAtual.ano;
  const mes = arquivoAtual.mes; // 1-12

  const startDateAtual = new Date(ano, mes - 1, 1);
  const endDateAtual = new Date(ano, mes, 0);

  const prevMes = mes === 1 ? 12 : mes - 1;
  const prevAno = mes === 1 ? ano - 1 : ano;
  const startDateAnterior = new Date(prevAno, prevMes - 1, 1);
  const endDateAnterior = new Date(prevAno, prevMes, 0);

  // 3. Fetch transactions for both months
  const movimentacoesAtuais = await findMovimentacoesByDateRange(
    usuarioId,
    startDateAtual,
    endDateAtual,
  );
  const movimentacoesAnteriores = await findMovimentacoesByDateRange(
    usuarioId,
    startDateAnterior,
    endDateAnterior,
  );

  // 4. Process data
  const processMovimentacoes = (movs: any[]) => {
    const gastosPorCategoria = new Map<string, number>();
    movs.forEach((mov) => {
      if (mov.tipo === "saida") {
        // QUE BUG BIZARRO - CATEGORIA É TORNADO EM CATEGORIUM PELO SEQUELIZE
        const categoriaNome = mov.Categorium?.nome || "Sem Categoria";
        const valorAtual = gastosPorCategoria.get(categoriaNome) || 0;
        gastosPorCategoria.set(
          categoriaNome,
          valorAtual + parseFloat(mov.valor),
        );
      }
    });
    return Object.fromEntries(gastosPorCategoria);
  };

  const gastosAtuais = processMovimentacoes(movimentacoesAtuais);
  const gastosAnteriores = processMovimentacoes(movimentacoesAnteriores);

  // 5. Calculate percentage change
  const allCategorias = new Set([
    ...Object.keys(gastosAtuais),
    ...Object.keys(gastosAnteriores),
  ]);
  const variacaoPercentual: Record<string, string> = {};
  allCategorias.forEach((cat) => {
    const atual = gastosAtuais[cat] || 0;
    const anterior = gastosAnteriores[cat] || 0;
    if (anterior > 0) {
      const variacao = ((atual - anterior) / anterior) * 100;
      variacaoPercentual[cat] = `${variacao.toFixed(2)}%`;
    } else if (atual > 0) {
      variacaoPercentual[cat] = "Novo gasto";
    } else {
      variacaoPercentual[cat] = "0.00%";
    }
  });

  // 6. Construct prompt
  const prompt = `
    **Análise Financeira Mensal para o Mês ${mes}/${ano}**

    **Contexto:** Você é um assistente financeiro especialista em análise de gastos pessoais. Sua tarefa é analisar os dados financeiros de um usuário, destacar as maiores variações de gastos em comparação com o mês anterior e fornecer insights práticos e acionáveis.

    **Dados Financeiros:**
    - **Saldo Final do Mês:** R$ ${arquivoAtual.saldoFinal.toFixed(2)}
    - **Resumo de Gastos do Mês Atual (${mes}/${ano}):**
      ${JSON.stringify(gastosAtuais, null, 2)}
    - **Resumo de Gastos do Mês Anterior (${prevMes}/${prevAno}):**
      ${JSON.stringify(gastosAnteriores, null, 2)}
    - **Variação Percentual dos Gastos por Categoria:**
      ${JSON.stringify(variacaoPercentual, null, 2)}

    **Sua Tarefa:**
    1.  **Análise Geral:** Comece com um parágrafo resumindo a saúde financeira geral do usuário neste mês, considerando o saldo final e o volume total de gastos.
    2.  **Destaque a Maior Variação:** Identifique a categoria que teve a maior variação percentual de aumento ou uma nova categoria de gasto significativo. Descreva essa mudança em detalhes.
    3.  **Outras Variações Notáveis:** Mencione 2 ou 3 outras categorias com mudanças significativas (aumento ou redução) e comente sobre elas.
    4.  **Insights e Recomendações:** Com base em todos os dados, forneça de 2 a 3 insights práticos. Por exemplo, se os gastos com "Restaurantes" aumentaram 50%, sugira formas de controlar esse custo. Se os gastos com "Transporte" diminuíram, elogie o usuário pela economia. As recomendações devem ser claras, diretas e fáceis de seguir.

    **Formato da Resposta:** Use Markdown para formatar a resposta de forma clara e legível, com títulos e listas.
  `;

  // 7. Call Gemini Service
  const analise = await geminiService.generateAnalysis(prompt);
  return { analise };
}
