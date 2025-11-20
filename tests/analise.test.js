import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
} from "vitest";
import { api, randomEmail } from "./testSetup.js";
import { createAndLoginUser } from "./utils/testClient.js";
import { Categoria, Movimentacao, ArquivoMensal } from "../src/models/index.js";

import { geminiService } from "../../../easy-finance-backend/src/services/GeminiService.js";

describe("AI Analysis API", () => {
  let token: string;
  let usuarioId: number;
  let arquivoAtualId: number;

  beforeEach(() => {
    vi.spyOn(geminiService, "generateAnalysis").mockResolvedValue(
      "This is a mock AI analysis.",
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeAll(async () => {
    // 1. Create user and get token
    const user = {
      nome: "Test User",
      email: randomEmail(),
      senha: "password123",
    };
    const loginInfo = await createAndLoginUser(user);
    token = loginInfo.token;
    usuarioId = loginInfo.user.usuarioID;

    // 2. Create categories
    const catAlimentacao = await Categoria.create({
      nome: "Alimentação",
      tipo: "saida",
      usuarioId,
    });
    const catSalario = await Categoria.create({
      nome: "Salário",
      tipo: "entrada",
      usuarioId,
    });

    // 3. Create ArquivoMensal for current and previous month
    const today = new Date();
    const prevMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);

    const arquivoAnterior = await ArquivoMensal.create({
      mes: prevMonth.getMonth() + 1,
      ano: prevMonth.getFullYear(),
      saldoFinal: 1500,
      usuarioId,
    });

    const arquivoAtual = await ArquivoMensal.create({
      mes: today.getMonth() + 1,
      ano: today.getFullYear(),
      saldoFinal: 2000,
      usuarioId,
    });
    arquivoAtualId = arquivoAtual.id;

    // 4. Create Movimentacoes for both months
    // Previous month
    await Movimentacao.create({
      descricao: "Supermercado",
      valor: 300,
      dataMovimentacao: new Date(
        prevMonth.getFullYear(),
        prevMonth.getMonth(),
        10,
      ),
      tipo: "saida",
      categoriaId: catAlimentacao.id,
      usuarioId,
      arquivoMensalId: arquivoAnterior.id,
    });
    // Current month
    await Movimentacao.create({
      descricao: "Salário",
      valor: 5000,
      dataMovimentacao: new Date(today.getFullYear(), today.getMonth(), 5),
      tipo: "entrada",
      categoriaId: catSalario.id,
      usuarioId,
      arquivoMensalId: arquivoAtual.id,
    });
    await Movimentacao.create({
      descricao: "Restaurante",
      valor: 150,
      dataMovimentacao: new Date(today.getFullYear(), today.getMonth(), 15),
      tipo: "saida",
      categoriaId: catAlimentacao.id,
      usuarioId,
      arquivoMensalId: arquivoAtual.id,
    });
  });

  afterAll(async () => {
    // Clean up database if necessary, or handled by teardown script
    vi.clearAllMocks();
  });

  it("should return a mock AI analysis for a given month", async () => {
    // Call the analysis endpoint
    const res = await api
      .get(`/api/arquivo/${arquivoAtualId}/analise`)
      .set("Authorization", `Bearer ${token}`);

    // Assertions
    expect(res.status).toBe(200);
    expect(res.body.analise).toBe("This is a mock AI analysis.");

    // Verify that the mocked service was called
    expect(geminiService.generateAnalysis).toHaveBeenCalledOnce();

    // Optional: Snapshot test the prompt sent to Gemini
    const prompt = (geminiService.generateAnalysis as any).mock.calls[0][0];
    expect(prompt).toContain("**Análise Financeira Mensal");
    expect(prompt).toContain("- **Saldo Final do Mês:** R$ 2000.00");
    expect(prompt).toContain(`"Alimentação": 150`); // Current month's spending
    expect(prompt).toContain(`"Alimentação": 300`); // Previous month's spending
    expect(prompt).toContain(`"Alimentação": "-50.00%"`); // Percentage change
  });
});
