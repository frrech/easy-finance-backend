import dotenv from "dotenv";
dotenv.config();
import { Sequelize } from "sequelize";

export const isTest = process.env.NODE_ENV === "test";

console.log("ENV LOADED IN DB.TS", {
  DB_NAME: process.env.DB_NAME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD
});

const sequelize = new Sequelize(
  isTest ? process.env.DB_NAME_TEST! : process.env.DB_NAME!,
  isTest ? process.env.DB_USER_TEST! : process.env.DB_ROOT_USER!,
  isTest ? process.env.DB_PASSWORD_TEST! : process.env.DB_ROOT_PASSWORD!,
  {
    dialect: "mysql",
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT) || 3306,
    logging: false
  }
);

export default sequelize;
