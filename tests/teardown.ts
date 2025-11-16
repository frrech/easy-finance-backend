import { sequelize } from "../src/app.js";

export default async function teardown() {
  await sequelize.close();
}
