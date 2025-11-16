import { describe, test, beforeAll, expect } from "vitest";
import { api, randomEmail } from "./setup.js";

let token: string;
let usuarioId: number;
let categoriaId: number;
let createdMovId: number;

describe("Movimentações API", () => {
  beforeAll(async () => {
    const email = randomEmail();
    const userRes = await api.post("/api/usuario").send({
      nome: "Test User",
      email,
      senha: "123456",
    });

    expect(userRes.status).toBe(201);

    const loginRes = await api.post("/api/usuario/login").send({
      email,
      senha: "123456",
    });

    expect(loginRes.status).toBe(200);

    token = loginRes.body.token;
    usuarioId = loginRes.body.usuario.usuarioID;

    const catRes = await api
      .post("/api/categoria")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: "Categoria Teste",
        tipo: "entrada",
      });

    expect(catRes.status).toBe(201);
    categoriaId = catRes.body.idCategoria;
  });

  test("should create a movimentação", async () => {
    const res = await api
      .post("/api/movimentacao")
      .set("Authorization", `Bearer ${token}`)
      .send({
        descricao: "Salário",
        valor: 3000.5,
        dataMovimentacao: "2025-01-01",
        tipo: "entrada",
        categoriaId,
      });

    expect(res.status).toBe(201);
    expect(res.body.idMovimentacao).toBeDefined();
    expect(Number(res.body.valor)).toBe(3000.5);

    createdMovId = res.body.idMovimentacao;
  });

  test("should list movimentações of the user", async () => {
    const res = await api
      .get(`/api/movimentacao/usuario/${usuarioId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("should get movimentação by ID", async () => {
    const res = await api
      .get(`/api/movimentacao/${createdMovId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.idMovimentacao).toBe(createdMovId);
  });

  test("should update movimentação", async () => {
    const res = await api
      .put(`/api/movimentacao/${createdMovId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        descricao: "Salário Editado",
        valor: 3500.0,
        dataMovimentacao: "2025-01-02",
        tipo: "entrada",
        categoriaId,
      });

    expect(res.status).toBe(200);
    expect(res.body.valor).toBe("3500.00");
    expect(res.body.descricao).toBe("Salário Editado");
  });

  test("should delete movimentação", async () => {
    const res = await api
      .delete(`/api/movimentacao/${createdMovId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(204);
  });

  test("should return 404 after deleting movimentação", async () => {
    const res = await api
      .get(`/api/movimentacao/${createdMovId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  test("should fail to create movimentação with invalid fields", async () => {
    const res = await api
      .post("/api/movimentacao")
      .set("Authorization", `Bearer ${token}`)
      .send({
        descricao: "",
        valor: "not-a-number",
        dataMovimentacao: "",
        tipo: "INVALIDO",
        categoriaId: null,
      });

    expect(res.status).toBe(400);
  });

  test("should reject access with no token", async () => {
    const res = await api.get(`/api/movimentacao/${usuarioId}`);
    expect(res.status).toBe(401);
  });
});
