import { Router } from 'express';
import * as movimentacao_controller from '../controllers/movimentacao.controller.js';

const router = Router();

router.post('/', movimentacao_controller.createMovimentacao);
router.get('/:id', movimentacao_controller.listMovimentacaoByID);
router.put('/:id', movimentacao_controller.updateMovimentacao);
router.delete('/:id', movimentacao_controller.deleteMovimentacao);

export default router;
