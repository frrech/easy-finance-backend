// src/routes/ArquivoMensalRouter.ts
import { Router } from "express";
import authenticateToken from "../middlewares/authenticateToken.js";
import * as ArquivoController from "../controllers/ArquivoMensalController.js";

const router = Router();

router.use(authenticateToken);

// generate & store
router.post("/generate", ArquivoController.gerarArquivoMensal);

/* -------------------------------------------------------
   📌 AI Analysis (MUST come before "/:ano/:mes" routes!)
--------------------------------------------------------- */
router.get("/analise/:id", ArquivoController.getAnaliseMensal);

// fetch json
router.get("/:ano/:mes", ArquivoController.getArquivoMensal);

// csv export
router.get("/:ano/:mes/csv", ArquivoController.downloadCsv);

// pdf export
router.get("/:ano/:mes/pdf", ArquivoController.downloadPdf);

router.get("/", ArquivoController.listarArquivos);

export default router;
