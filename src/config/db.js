import { Sequelize } from "sequelize";
const sequelize = new Sequelize(
    process.env.DB_NAME || 'easyfinancedb',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD,
    {    dialect:'mysql', 
    host:'localhost',
    port:3306
});
export default sequelize;