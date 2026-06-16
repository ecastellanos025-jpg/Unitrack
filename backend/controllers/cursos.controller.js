const { readJSON, writeJSON } = require('../services/db');
const CursosTree = require('../services/cursos.service');

// Instancia global en memoria del árbol
const catalogoCursos = new CursosTree();

// Cargar cursos del JSON a la estructura en memoria al iniciar
const cargarDatosALaEstructura = () => {
    try {
        const datos = readJSON('cursos.json', []);
        catalogoCursos.raiz = null;
        
        datos.forEach(curso => {
            // Por defecto, cargamos como AVL para mantener balance
            catalogoCursos.insertarAVL(curso);
        });
        console.log(`¡Árbol de Cursos reconstruido con éxito! Nodos: ${catalogoCursos.inOrden().length}`);
    } catch (error) {
        console.error('Error al cargar cursos en el árbol:', error.message);
    }
};

// GET /api/cursos
const getCursos = (req, res) => {
    try {
        const todos = catalogoCursos.inOrden();
        // Enriquecer cada curso con cupos en tiempo real
        const inscripciones = readJSON('inscripciones.json', []);
        const cursosConCupos = todos.map(curso => {
            const ocupados = inscripciones.filter(
                ins => ins.curso === curso.codigo && ins.estado !== 'cancelada'
            ).length;
            return {
                ...curso,
                cuposOcupados: ocupados,
                cuposDisponibles: curso.cupoMaximo - ocupados
            };
        });
        res.json(cursosConCupos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener catálogo de cursos", error: error.message });
    }
};

// POST /api/cursos
const createCurso = (req, res) => {
    const { codigo, nombre, creditos, catedratico, horario, cupoMaximo, tipo = 'AVL' } = req.body;

    if (!codigo || !nombre || !creditos) {
        return res.status(400).json({ message: "Código, nombre y créditos son obligatorios" });
    }

    try {
        // Verificar duplicados
        if (catalogoCursos.buscar(codigo)) {
            return res.status(400).json({ message: `El curso con código ${codigo} ya existe` });
        }

        const nuevoCurso = {
            codigo,
            nombre,
            creditos: Number(creditos),
            catedratico,
            horario,
            cupoMaximo: Number(cupoMaximo) || 30
        };

        // Insertar en la estructura en memoria según el tipo elegido
        if (tipo === 'BST') {
            catalogoCursos.insertarBST(nuevoCurso);
        } else {
            catalogoCursos.insertarAVL(nuevoCurso);
        }

        // Persistir la lista de cursos en el archivo JSON
        writeJSON('cursos.json', catalogoCursos.inOrden());

        res.status(201).json({
            message: `Curso insertado correctamente en árbol ${tipo}`,
            curso: nuevoCurso
        });
    } catch (error) {
        res.status(500).json({ message: "Error al registrar curso", error: error.message });
    }
};

// DELETE /api/cursos/:codigo
const deleteCurso = (req, res) => {
    const { codigo } = req.params;

    try {
        const eliminado = catalogoCursos.eliminar(codigo);
        if (!eliminado) {
            return res.status(404).json({ message: "Curso no encontrado en el catálogo" });
        }

        // Actualizar JSON
        writeJSON('cursos.json', catalogoCursos.inOrden());

        res.json({ message: "Curso eliminado correctamente del catálogo" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar curso", error: error.message });
    }
};

// GET /api/cursos/inorden
const getInOrden = (req, res) => {
    res.json(catalogoCursos.inOrden());
};

// GET /api/cursos/preorden
const getPreOrden = (req, res) => {
    res.json(catalogoCursos.preOrden());
};

// GET /api/cursos/postorden
const getPostOrden = (req, res) => {
    res.json(catalogoCursos.postOrden());
};

// GET /api/cursos/stats
const getStats = (req, res) => {
    res.json({
        totalNodos: catalogoCursos.inOrden().length,
        altura: catalogoCursos.obtenerAlturaTotal(),
        minimo: catalogoCursos.encontrarMinimo(),
        maximo: catalogoCursos.encontrarMaximo()
    });
};

// GET /api/cursos/grafico - Retorna jerarquía estructurada para visualizador
const getGrafico = (req, res) => {
    res.json({
        raiz: catalogoCursos.obtenerFormatoGrafico()
    });
};

// GET /api/cursos/cupos - Cupos disponibles de todos los cursos
const getCupos = (req, res) => {
    try {
        const todos = catalogoCursos.inOrden();
        const inscripciones = readJSON('inscripciones.json', []);
        const cupos = todos.map(curso => {
            const ocupados = inscripciones.filter(
                ins => ins.curso === curso.codigo && ins.estado !== 'cancelada'
            ).length;
            return {
                codigo: curso.codigo,
                nombre: curso.nombre,
                cupoMaximo: curso.cupoMaximo,
                cuposOcupados: ocupados,
                cuposDisponibles: curso.cupoMaximo - ocupados
            };
        });
        res.json(cupos);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener cupos", error: error.message });
    }
};

module.exports = {
    cargarDatosALaEstructura,
    getCursos,
    createCurso,
    deleteCurso,
    getInOrden,
    getPreOrden,
    getPostOrden,
    getStats,
    getGrafico,
    getCupos
};
