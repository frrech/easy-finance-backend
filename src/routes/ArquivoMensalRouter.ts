import { Router } from "express";
import authenticateToken from "../middlewares/authenticateToken.js";
import * as ArquivoController from "../controllers/ArquivoMensalController.js";

const router = Router();

router.use(authenticateToken);

// ===================================================
// 🧾 Generate Monthly Report
// ===================================================
router.post("/generate", ArquivoController.gerarArquivoMensal);

// ===================================================
// 🧠 AI Analysis (cached + regeneration)
// ===================================================

// Get AI analysis (cached)
router.get("/analise/:id", ArquivoController.getAnaliseMensal);

// Force regenerate AI analysis
router.post(
  "/analise/:id/regenerate",
  ArquivoController.regenerateAnaliseMensal
);

// ===================================================
// 📄 Fetch report JSON
// ===================================================
router.get("/:ano/:mes", ArquivoController.getArquivoMensal);

// CSV
router.get("/:ano/:mes/csv", ArquivoController.downloadCsv);

// PDF
router.get("/:ano/:mes/pdf", ArquivoController.downloadPdf);

// List summaries
router.get("/", ArquivoController.listarArquivos);

export default router;
