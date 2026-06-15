const { Router } = require('express');
const router = Router();
const {
    getPensum,
    createCursoVertex,
    deleteCursoVertex,
    createPrerrequisito,
    deletePrerrequisito,
    getTopologicalSort,
    getDetectCycles,
    getShortestPath,
    getCursoPrerequisites
} = require('../controllers/pensum.controller');

// Obtener estructura completa y modificar
router.get('/', getPensum);
router.post('/cursos', createCursoVertex);
router.delete('/cursos/:codigo', deleteCursoVertex);
router.post('/prerrequisitos', createPrerrequisito);
router.delete('/prerrequisitos', deletePrerrequisito);

// Algoritmos especiales
router.get('/topological-sort', getTopologicalSort);
router.get('/detect-cycles', getDetectCycles);
router.get('/shortest-path', getShortestPath);
router.get('/:codigo/prerequisites', getCursoPrerequisites);

module.exports = router;
