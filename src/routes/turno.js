import { Router } from 'express';
import {
  agendarTurno,
  cancelarTurno,
  listarTurnos
} from '../controllers/turnoController.js';

const router = Router();

router.post('/', agendarTurno);
router.delete('/:id', cancelarTurno);
router.get('/', listarTurnos);

export default router;
