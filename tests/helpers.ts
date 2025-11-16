// tests/helpers.ts

import { api } from "./setup.js";

export async function createAndLoginUser(userData = {}) {
  const defaultUser = {
    nome: "Tester",
    email: `tester_${Date.now()}@mail.com`,
    senha: "123456",
  };

  const user = { ...defaultUser, ...userData };

  const created = await api.post("/api/usuario").send(user);
  if (created.status !== 201) {
    throw new Error("User creation failed: " + created.text);
  }

  const login = await api.post("/api/usuario/login").send({
    email: user.email,
    senha: user.senha,
  });

  if (!login.body.token) {
    throw new Error("Login failed: " + login.text);
  }

  return {
    user: created.body,
    token: login.body.token,
  };
}

export function authGet(token: string, url: string) {
  return api.get(url).set("Authorization", `Bearer ${token}`);
}

export function authPost(token: string, url: string, body: any) {
  return api.post(url).set("Authorization", `Bearer ${token}`).send(body);
}

export function authPut(token: string, url: string, body: any) {
  return api.put(url).set("Authorization", `Bearer ${token}`).send(body);
}

export function authDelete(token: string, url: string) {
  return api.delete(url).set("Authorization", `Bearer ${token}`);
}
