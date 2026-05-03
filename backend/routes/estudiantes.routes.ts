import { Router } from 'express';
import { getEstudiantes, invertirLista, buscarEstudiante } from '../controllers/estudiante.controller';

const router = Router();

// Endpoint para listar (Requisito 2.1)
router.get('/estudiantes', getEstudiantes);

// Endpoint para buscar por carnet (Requisito 2.1)
router.get('/estudiantes/:carnet', buscarEstudiante);

// Endpoint especial para invertir la lista (Requisito 2.1)
router.post('/estudiantes/invertir', invertirLista);

export default router;