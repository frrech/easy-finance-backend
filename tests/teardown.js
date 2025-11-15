import { sequelize } from "../src/app.js";

export default async () => {
  await sequelize.close();
};
