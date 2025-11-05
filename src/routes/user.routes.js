import { Router } from 'express';
import * as usuario_controller from '../controllers/user.controller.js';

const router = Router();

router.post('/', usuario_controller.createUsuario);
router.get('/:id', usuario_controller.listUsuarioByID);
router.put('/:id', usuario_controller.updateUsuario);
router.delete('/:id', usuario_controller.deleteUsuario);

export default router;
