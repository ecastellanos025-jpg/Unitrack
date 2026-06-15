const { Router } = require('express');
const router = Router();
const {
    getCursos,
    createCurso,
    deleteCurso,
    getInOrden,
    getPreOrden,
    getPostOrden,
    getStats,
    getGrafico
} = require('../controllers/cursos.controller');

// CRUD básico y listados
router.get('/', getCursos);
router.post('/', createCurso);
router.delete('/:codigo', deleteCurso);

// Recorridos
router.get('/inorden', getInOrden);
router.get('/preorden', getPreOrden);
router.get('/postorden', getPostOrden);

// Estadísticas e información del árbol
router.get('/stats', getStats);
router.get('/grafico', getGrafico);

module.exports = router;
