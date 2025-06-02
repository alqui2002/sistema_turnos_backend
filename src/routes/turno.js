import { Router } from 'express';
import {
  agendarTurno,
  cancelarTurno,
  listarTurnos,
  listarTurnosPorBarbero
} from '../controllers/turnoController.js';

const router = Router();

router.post('/', agendarTurno);
router.delete('/:id', cancelarTurno);
router.get('/', listarTurnos);
router.get('/barbero/:barberoId', listarTurnosPorBarbero);

export default router;
