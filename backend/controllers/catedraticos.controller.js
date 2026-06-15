const { readJSON, writeJSON } = require('../services/db');
const CatedraticosHashTable = require('../services/catedraticos.service');

// Instancia global de la tabla hash (capacidad inicial 11)
const tablaCatedraticos = new CatedraticosHashTable(11);

// Cargar catedráticos del JSON a la estructura en memoria al iniciar
const cargarDatosALaEstructura = () => {
    try {
        const datos = readJSON('catedraticos.json', []);
        
        // Limpiar
        tablaCatedraticos.buckets = new Array(tablaCatedraticos.capacity).fill(null);
        tablaCatedraticos.size = 0;
        tablaCatedraticos.collisionCount = 0;

        datos.forEach(cat => {
            tablaCatedraticos.insertar(cat.codigoEmpleado, cat);
        });
        console.log(`¡Tabla Hash de Catedráticos reconstruida con éxito! Elementos: ${tablaCatedraticos.size}, Colisiones: ${tablaCatedraticos.collisionCount}`);
    } catch (error) {
        console.error('Error al cargar catedráticos en la tabla:', error.message);
    }
};

// GET /api/catedraticos - Devuelve lista plana y buckets
const getCatedraticos = (req, res) => {
    try {
        res.json({
            elementos: tablaCatedraticos.obtenerListaElementos(),
            buckets: tablaCatedraticos.obtenerEstadoBuckets()
        });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener catedráticos", error: error.message });
    }
};

// GET /api/catedraticos/:codigo - Buscar
const getCatedraticoByCodigo = (req, res) => {
    const { codigo } = req.params;
    try {
        const catedratico = tablaCatedraticos.buscar(codigo);
        if (!catedratico) {
            return res.status(404).json({ message: `Catedrático con código ${codigo} no encontrado` });
        }
        res.json(catedratico);
    } catch (error) {
        res.status(500).json({ message: "Error al buscar catedrático", error: error.message });
    }
};

// POST /api/catedraticos - Insertar
const createCatedratico = (req, res) => {
    const { codigoEmpleado, nombre, especialidad, email } = req.body;

    if (!codigoEmpleado || !nombre || !email) {
        return res.status(400).json({ message: "El código de empleado, nombre y email son obligatorios" });
    }

    try {
        // Verificar si ya existe
        if (tablaCatedraticos.buscar(codigoEmpleado)) {
            return res.status(400).json({ message: `El catedrático con código ${codigoEmpleado} ya existe` });
        }

        const nuevoCatedratico = { codigoEmpleado, nombre, especialidad, email };
        
        // Insertar en la tabla
        tablaCatedraticos.insertar(codigoEmpleado, nuevoCatedratico);

        // Persistir todos en el archivo JSON
        writeJSON('catedraticos.json', tablaCatedraticos.obtenerListaElementos());

        res.status(201).json({
            message: "Catedrático insertado con éxito",
            catedratico: nuevoCatedratico
        });
    } catch (error) {
        res.status(500).json({ message: "Error al crear catedrático", error: error.message });
    }
};

// DELETE /api/catedraticos/:codigo - Eliminar
const deleteCatedratico = (req, res) => {
    const { codigo } = req.params;

    try {
        const eliminado = tablaCatedraticos.eliminar(codigo);
        if (!eliminado) {
            return res.status(404).json({ message: `Catedrático con código ${codigo} no encontrado` });
        }

        // Persistir cambios
        writeJSON('catedraticos.json', tablaCatedraticos.obtenerListaElementos());

        res.json({ message: `Catedrático con código ${codigo} eliminado con éxito` });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar catedrático", error: error.message });
    }
};

// POST /api/catedraticos/config - Re-configurar tipo de hash y colisiones
const configTable = (req, res) => {
    const { hashFunctionType, collisionMethod } = req.body;

    if (!hashFunctionType || !collisionMethod) {
        return res.status(400).json({ message: "El tipo de función hash y método de colisión son requeridos" });
    }

    try {
        tablaCatedraticos.configurar(hashFunctionType, collisionMethod);
        res.json({
            message: "Tabla Hash reconfigurada y reconstruida con éxito",
            stats: {
                hashFunctionType: tablaCatedraticos.hashFunctionType,
                collisionMethod: tablaCatedraticos.collisionMethod,
                collisions: tablaCatedraticos.collisionCount,
                capacity: tablaCatedraticos.capacity,
                loadFactor: tablaCatedraticos.obtenerFactorCarga()
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error al reconfigurar tabla", error: error.message });
    }
};

// GET /api/catedraticos/stats - Obtener estadísticas en tiempo real
const getStats = (req, res) => {
    res.json({
        size: tablaCatedraticos.size,
        capacity: tablaCatedraticos.capacity,
        loadFactor: tablaCatedraticos.obtenerFactorCarga(),
        collisions: tablaCatedraticos.collisionCount,
        hashFunctionType: tablaCatedraticos.hashFunctionType,
        collisionMethod: tablaCatedraticos.collisionMethod
    });
};

module.exports = {
    cargarDatosALaEstructura,
    getCatedraticos,
    getCatedraticoByCodigo,
    createCatedratico,
    deleteCatedratico,
    configTable,
    getStats
};
