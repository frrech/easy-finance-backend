import { describe, test, expect } from "vitest";
import { api } from "./setup.js";
import {
  createAndLoginUser,
  authGet,
  authPost,
  authPut,
  authDelete,
} from "./utils/testClient.js";

describe("Category API", () => {
  test("should create a new category", async () => {
    const { token } = await createAndLoginUser();

    const res = await authPost(token, "/api/categoria", {
      nome: "Alimentação",
      tipo: "saida",
    });

    expect(res.status).toBe(201);
    expect(res.body.idCategoria).toBeTruthy();
    expect(res.body.nome).toBe("Alimentação");
    expect(res.body.tipo).toBe("saida");
    expect(res.body.usuarioId).toBeDefined();
  });

  test("should list categories for the authenticated user", async () => {
    const { token } = await createAndLoginUser();

    await authPost(token, "/api/categoria", {
      nome: "Salário",
      tipo: "entrada",
    });

    await authPost(token, "/api/categoria", {
      nome: "Transporte",
      tipo: "saida",
    });

    const res = await authGet(token, "/api/categoria");

    expect(res.status).toBe(200);

    interface Categoria {
      idCategoria: number;
      nome: string;
      tipo: string;
      usuarioId: number;
    }

    const categorias = res.body as Categoria[];

    expect(categorias.length).toBe(2);

    const names = categorias.map((c) => c.nome);
    expect(names).toContain("Salário");
    expect(names).toContain("Transporte");
  });

  test("should get a category by ID", async () => {
    const { token } = await createAndLoginUser();

    const created = await authPost(token, "/api/categoria", {
      nome: "Internet",
      tipo: "saida",
    });

    const id = created.body.idCategoria;

    const res = await authGet(token, `/api/categoria/${id}`);

    expect(res.status).toBe(200);
    expect(res.body.idCategoria).toBe(id);
    expect(res.body.nome).toBe("Internet");
  });

  test("should update a category", async () => {
    const { token } = await createAndLoginUser();

    const created = await authPost(token, "/api/categoria", {
      nome: "Mercado",
      tipo: "saida",
    });

    const id = created.body.idCategoria;

    const res = await authPut(token, `/api/categoria/${id}`, {
      nome: "Supermercado",
      tipo: "saida",
    });

    expect(res.status).toBe(200);
    expect(res.body.nome).toBe("Supermercado");
  });

  test("should delete a category", async () => {
    const { token } = await createAndLoginUser();

    const created = await authPost(token, "/api/categoria", {
      nome: "Academia",
      tipo: "saida",
    });

    const id = created.body.idCategoria;

    const delRes = await authDelete(token, `/api/categoria/${id}`);
    expect(delRes.status).toBe(204);

    const getRes = await authGet(token, `/api/categoria/${id}`);
    expect(getRes.status).toBe(404);
  });

  test("should NOT let user access another user's category", async () => {
    const user1 = await createAndLoginUser();
    const user2 = await createAndLoginUser();

    const created = await authPost(user1.token, "/api/categoria", {
      nome: "Privado",
      tipo: "saida",
    });

    const id = created.body.idCategoria;

    const res = await authGet(user2.token, `/api/categoria/${id}`);

    expect(res.status).toBe(404);
  });

  test("should reject creation without token", async () => {
    const res = await api.post("/api/categoria").send({
      nome: "Teste",
      tipo: "saida",
    });

    expect(res.status).toBe(401);
  });

  test("should reject invalid category type", async () => {
    const { token } = await createAndLoginUser();

    const res = await authPost(token, "/api/categoria", {
      nome: "Erro",
      tipo: "INVALIDO",
    });

    expect(res.status).toBe(400);
  });
});
