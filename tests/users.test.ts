import { describe, test, expect } from "vitest";
import { api, randomEmail } from "./setup.js";
import {
  createAndLoginUser,
  authGet,
  authPut,
  authDelete,
} from "./utils/testClient.js";

describe("User API", () => {
  test("should create a new user", async () => {
    const response = await api.post("/api/usuario").send({
      nome: "João Teste",
      email: randomEmail(),
      senha: "123456",
    });

    expect(response.status).toBe(201);
    expect(response.body.usuarioID).toBeTruthy();
    expect(response.body.senha).toBeUndefined();
  });

  test("should login a user and return JWT", async () => {
    const email = randomEmail();
    const senha = "123456";

    await api.post("/api/usuario").send({ nome: "Login User", email, senha });

    const login = await api.post("/api/usuario/login").send({ email, senha });

    expect(login.status).toBe(200);
    expect(login.body.token).toBeDefined();
  });

  test("should return authenticated user with /me", async () => {
    const { token } = await createAndLoginUser();

    const res = await authGet(token, "/api/usuario/me");

    expect(res.status).toBe(200);
    expect(res.body.email).toBeDefined();
  });

  test("should get user by ID", async () => {
    const { user } = await createAndLoginUser();

    const res = await api.get(`/api/usuario/${user.usuarioID}`);

    expect(res.status).toBe(200);
    expect(res.body.usuarioID).toBe(user.usuarioID);
  });

  test("should update a user", async () => {
    const { user, token } = await createAndLoginUser();

    const res = await authPut(token, `/api/usuario/${user.usuarioID}`, {
      nome: "Updated User",
    });

    expect(res.status).toBe(200);
    expect(res.body.nome).toBe("Updated User");
  });

  test("should delete a user", async () => {
    const { user, token } = await createAndLoginUser();

    const res = await authDelete(token, `/api/usuario/${user.usuarioID}`);

    expect(res.status).toBe(204);
  });

  test("should NOT login with wrong password", async () => {
    const email = randomEmail();
    await api.post("/api/usuario").send({ nome: "X", email, senha: "123456" });

    const login = await api.post("/api/usuario/login").send({
      email,
      senha: "wrong-password",
    });

    expect(login.status).toBe(401);
  });

  test("should block /me without token", async () => {
    const res = await api.get("/api/usuario/me");
    expect(res.status).toBe(401);
  });
});
