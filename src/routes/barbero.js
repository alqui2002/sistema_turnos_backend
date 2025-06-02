import { Router } from 'express';
import {
  listarBarberos,
  disponibilidadBarbero,
  getBarbero
} from '../controllers/barberoController.js';

const router = Router();
router.get('/', listarBarberos);
router.get("/:id", getBarbero);

router.get('/:id/disponibilidad', disponibilidadBarbero);

export default router;
