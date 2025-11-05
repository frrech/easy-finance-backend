import { Router } from 'express';
import * as arquivo_mensal_controller from '../controllers/arquivo_mensal.controller.js';

const router = Router();

router.post('/', arquivo_mensal_controller.createArquivoMensal);
router.get('/:id', arquivo_mensal_controller.listArquivoByID);
router.put('/:id', arquivo_mensal_controller.updateArquivoMensal);
router.delete('/:id', arquivo_mensal_controller.deleteArquivo);

export default router;
