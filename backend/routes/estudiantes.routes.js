const { Router } = require('express');
const router = Router();
const {
    getEstudiantes,
    buscarEstudiante,
    createEstudiante,
    updateEstudiante,
    deleteEstudiante,
    invertirLista,
    getHistorial,
    createInscripcion,
    deleteInscripcion
} = require('../controllers/estudiante.controller');

// Obtener todos los estudiantes (búsqueda y paginación)
router.get('/', getEstudiantes);

// Invertir lista in-place
router.post('/invertir', invertirLista);

// Crear un nuevo estudiante
router.post('/', createEstudiante);

// Buscar un estudiante específico
router.get('/:carnet', buscarEstudiante);

// Actualizar un estudiante por carnet
router.put('/:carnet', updateEstudiante);

// Eliminar un estudiante por carnet
router.delete('/:carnet', deleteEstudiante);

// --- RUTAS DEL HISTORIAL DE INSCRIPCIONES (Lista Doblemente Enlazada) ---

// Obtener historial de inscripciones
router.get('/:carnet/historial', getHistorial);

// Agregar una inscripción
router.post('/:carnet/historial', createInscripcion);

// Eliminar una inscripción
router.delete('/:carnet/historial/:curso', deleteInscripcion);

module.exports = router;