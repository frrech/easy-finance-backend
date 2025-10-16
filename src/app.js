import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middlewares/errorHandler.js';
import userRoutes from './routes/user.routes.js';

const app = express();
const db = require('../db/db')
(async () => {
    await db.sync()

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
