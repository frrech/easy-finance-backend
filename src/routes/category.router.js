import * as category_controller from "../controllers/category.controller.js";
import {Router} from 'express';
const router = Router();

router.post('/', category_controller.createCategoria);
router.get('/:id', category_controller.listCategoriaByID);
router.put('/:id', category_controller.updateCategoria);
router.delete('/:id', category_controller.deleteCategoria);

export default router;
