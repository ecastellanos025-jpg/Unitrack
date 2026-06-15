const { Router } = require('express');
const router = Router();
const {
    getCatedraticos,
    getCatedraticoByCodigo,
    createCatedratico,
    deleteCatedratico,
    configTable,
    getStats
} = require('../controllers/catedraticos.controller');

// CRUD y listados
router.get('/', getCatedraticos);
router.post('/', createCatedratico);
router.get('/stats', getStats);
router.post('/config', configTable);
router.get('/:codigo', getCatedraticoByCodigo);
router.delete('/:codigo', deleteCatedratico);

module.exports = router;
