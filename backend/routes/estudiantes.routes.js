const { Router } = require('express');
const router = Router();
const {
    getEstudiantes,
    createEstudiante,
    updateEstudiante,
    deleteEstudiante,
    invertirLista,
} = require('../controllers/estudiante.controller');

// Obtener todos los estudiantes (incluye búsqueda y paginación) [cite: 21, 22]
router.get('/', getEstudiantes);

// Invertir lista in-place (Requisito 2.1)
router.post('/invertir', invertirLista);

// Crear un nuevo estudiante 
router.post('/', createEstudiante);

// Actualizar un estudiante por carnet 
router.put('/:carnet', updateEstudiante);

// Eliminar un estudiante por carnet
router.delete('/:carnet', deleteEstudiante);

module.exports = router;