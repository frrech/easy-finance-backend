import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middlewares/errorHandler.js';
import userRoutes from './routes/user.routes.js';
const app = express();
import { Sequelize } from "sequelize";
const sequelize = new Sequelize(
    process.env.DB_NAME || 'easyfinancedb',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD,
    {    dialect:'mysql', 
    host:'localhost',
    port:3306
});

(async () => {
    await sequelize.sync();

    // Middlewares
    app.use(express.json());
    app.use(cors());
    app.use(helmet());
    app.use(morgan('dev'));

    // Routes
    app.use('/api/users', userRoutes);

    // Error Handler
    app.use(errorHandler);
})();

export default app;
