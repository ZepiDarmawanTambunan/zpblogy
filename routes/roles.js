import express from 'express';
import * as rolesHandler from './handler/roles/index.js';

const router = express.Router();

router.get('/all', rolesHandler.getAll);
router.get('/', rolesHandler.paginate);
router.get('/:id', rolesHandler.get);
router.post('/', rolesHandler.create);
router.put('/:id', rolesHandler.update);
router.delete('/:id', rolesHandler.destroy);

export default router;