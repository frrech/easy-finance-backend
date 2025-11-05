import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middlewares/errorHandler.js';
import userRoutes from './routes/user.routes.js';
import categoryRoutes from './routes/category.router.js';
import movimentacaoRouter from './routes/movimentacao.router.js';
import arquivoRouter from './routes/arquivo_mensal.router.js'
const app = express();
import sequelize from './config/db.js';

(async () => {
    await sequelize.sync();

    // Middlewares
    app.use(express.json());
    app.use(cors());
    app.use(helmet());
    app.use(morgan('dev'));

    // Routes
    app.use('/api/users', userRoutes);
    app.use('/api/category', categoryRoutes);
    app.use('/api/movimentacao', movimentacaoRouter);
    app.use('/api/arquivo', arquivoRouter);

    // Error Handler
    app.use(errorHandler);
})();

export default app;
