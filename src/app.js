import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middlewares/errorHandler.js';

import UsuarioRouter from './routes/UsuarioRouter.js';
import CategoriaRouter from './routes/CategoriaRouter.js';
import MovimentacaoRouter from './routes/MovimentacaoRouter.js';
import ArquivoMensalRouter from './routes/ArquivoMensalRouter.js';
import AuthRouter from './routes/AuthRouter.js';

import sequelize from './config/db.js';
import { setupDatabase } from './config/dbSetup.js';
import { swaggerUi, swaggerSpec } from "./config/swagger.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/auth", AuthRouter);
app.use('/api/usuario', UsuarioRouter);
app.use('/api/categoria', CategoriaRouter);
app.use('/api/movimentacao', MovimentacaoRouter);
app.use('/api/arquivo', ArquivoMensalRouter);

app.use(errorHandler);

export { app, sequelize, setupDatabase };
