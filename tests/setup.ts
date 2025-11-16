import request from "supertest";
import { app } from "../src/app.js";
import { afterAll, vi } from "vitest";
import sequelize from "../src/config/db.js";

// Export API instance just like before
export const api = request(app);

export function randomEmail() {
  return `user_${Math.floor(Math.random() * 999999)}@test.com`;
}

// Silence console logs
global.console = {
  ...console,
  log: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
  warn: vi.fn(),
};

// Timeout equivalent to jest.setTimeout()
vi.setConfig({ testTimeout: 20000 });

// Close DB after all tests
afterAll(async () => {
  try {
    await sequelize.close();
  } catch (err) {
    console.error("Error closing Sequelize:", err);
  }
});
