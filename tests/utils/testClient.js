import { api } from "../setup.js";

export async function createAndLoginUser(userData = {}) {
  const defaultUser = {
    nome: "Tester",
    email: `tester_${Date.now()}@mail.com`,
    senha: "123456"
  };

  const user = { ...defaultUser, ...userData };

  // 1️⃣ Create user
  const created = await api.post("/api/usuario").send(user);
  if (created.status !== 201) {
    throw new Error("User creation failed: " + created.text);
  }

  // 2️⃣ Login
  const login = await api.post("/api/usuario/login").send({
    email: user.email,
    senha: user.senha
  });

  if (!login.body.token) {
    throw new Error("Login failed: " + login.text);
  }

  return {
    user: created.body,
    token: login.body.token,
  };
}

export async function authGet(token, url) {
  return api.get(url).set("Authorization", `Bearer ${token}`);
}

export async function authPost(token, url, body) {
  return api.post(url).set("Authorization", `Bearer ${token}`).send(body);
}

export async function authPut(token, url, body) {
  return api.put(url).set("Authorization", `Bearer ${token}`).send(body);
}

export async function authDelete(token, url) {
  return api.delete(url).set("Authorization", `Bearer ${token}`);
}
