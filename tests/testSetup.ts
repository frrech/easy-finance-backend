import { beforeAll, afterAll, vi } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import sequelize from "../src/config/db.js";
import { initModels } from "../src/models/index.js";

// 👇 AQUI criamos o client Supertest
export const api = request(app);

// desabilita logs durante os testes
global.console = {
  ...console,
  log: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
};

beforeAll(async () => {
  initModels(sequelize);    // inicializa models + associations
  await sequelize.sync({ force: true }); // recria tabelas
});

afterAll(async () => {
  await sequelize.close();
});

export function randomEmail() {
  return `user_${Math.floor(Math.random() * 999999)}@test.com`;
}
