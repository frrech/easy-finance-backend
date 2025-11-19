import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import UsuarioRouter from "./routes/UsuarioRouter.js";
import CategoriaRouter from "./routes/CategoriaRouter.js";
import MovimentacaoRouter from "./routes/MovimentacaoRouter.js";
import ArquivoMensalRouter from "./routes/ArquivoMensalRouter.js";
import AuthRouter from "./routes/AuthRouter.js";

import { errorHandler } from "./middlewares/errorHandler.js";
import sequelize from "./config/db.js";
import { initModels } from "./models/index.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use((req, res, next) => {
  console.log("➡️  Incoming request:", req.method, req.originalUrl);
  console.log("🟦 Headers:", req.headers);
  next();
});

app.use("/api/auth", AuthRouter);
app.use("/api/usuario", UsuarioRouter);
app.use("/api/categoria", CategoriaRouter);
app.use("/api/movimentacao", MovimentacaoRouter);
app.use("/api/arquivo", ArquivoMensalRouter);

app.use(errorHandler);

export default app;
export { sequelize };
