import { jest } from '@jest/globals';
import app from "../src/app.js";
import request from "supertest";
import sequelize from "../src/config/db.js";

export const api = request(app);

export function randomEmail() {
  return `user_${Math.floor(Math.random() * 999999)}@test.com`;
}

// Silence console logs to keep test output clean
global.console = {
  ...console,
  log: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  warn: jest.fn(),
};

jest.setTimeout(20000);

afterAll(async () => {
  try {
    await sequelize.connectionManager.close();
  } catch (err) {
    console.error("Error closing Sequelize:", err);
  }
});
