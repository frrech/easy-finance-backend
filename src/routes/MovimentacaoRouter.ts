// src/routes/MovimentacaoRouter.ts
import { Router } from "express";
import authenticateToken from "../middlewares/authenticateToken.js";
import * as MovController from "../controllers/MovimentacaoController.js";

const router = Router();

router.use(authenticateToken);

router.post("/", MovController.createMovimentacao);
router.get("/", MovController.listMovimentacoes);
router.get("/:id", MovController.getMovimentacao);
router.put("/:id", MovController.updateMovimentacao);
router.delete("/:id", MovController.deleteMovimentacao);

export default router;
