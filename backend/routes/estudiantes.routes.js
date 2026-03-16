const { Router } = require('express');
const router = Router();
const {
    getEstudiantes,
    createEstudiante,
    updateEstudiante,
    deleteEstudiante
} = require('../controllers/estudiante.controller');

// Obtener todos los estudiantes (incluye búsqueda y paginación) [cite: 21, 22]
router.get('/', getEstudiantes);

// Crear un nuevo estudiante 
router.post('/', createEstudiante);

// Actualizar un estudiante por ID 
router.put('/:id', updateEstudiante);

// Eliminar un estudiante 
router.delete('/:id', deleteEstudiante);

module.exports = router;