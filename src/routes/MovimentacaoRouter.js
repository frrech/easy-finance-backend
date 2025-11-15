import { Router } from "express";
import * as MovimentacaoController from "../controllers/MovimentacaoController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", authenticateToken, MovimentacaoController.createMovimentacao);
router.get("/usuario/:usuario_id", authenticateToken, MovimentacaoController.listMovimentacoesByUsuario);
router.get("/:id", authenticateToken, MovimentacaoController.listMovimentacaoByID);
router.put("/:id", authenticateToken, MovimentacaoController.updateMovimentacao);
router.delete("/:id", authenticateToken, MovimentacaoController.deleteMovimentacao);

export default router;
