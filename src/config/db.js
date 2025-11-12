import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DB_NAME || 'easyfinancedb',
  process.env.DB_USER || 'easyfinance_user',
  process.env.DB_PASSWORD || 'easyfinance_pass',
  {
    dialect: 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    logging: false
  }
);

export default sequelize;
