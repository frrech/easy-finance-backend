// src/bootstrapModels.ts
import sequelize from "./config/db.js";
import { initModels } from "./models/index.js";

export function bootstrapModels() {
  initModels(sequelize);
}
