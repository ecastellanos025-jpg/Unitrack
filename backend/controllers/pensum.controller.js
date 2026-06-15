const { readJSON, writeJSON } = require('../services/db');
const PensumGraph = require('../services/pensum.service');

// Instancia global en memoria del Grafo
const pensumGraph = new PensumGraph();

// Cargar datos desde JSON al iniciar
const cargarDatosALaEstructura = () => {
    try {
        const datos = readJSON('pensum.json', { vertices: [], edges: [] });
        
        // Limpiar
        pensumGraph.vertices = [];
        pensumGraph.adjList = {};

        // Agregar vértices del JSON
        if (datos.vertices) {
            datos.vertices.forEach(codigo => {
                pensumGraph.agregarCurso(codigo);
            });
        }

        // Agregar aristas del JSON
        if (datos.edges) {
            datos.edges.forEach(edge => {
                pensumGraph.agregarPrerrequisito(edge.source, edge.target);
            });
        }

        // Sincronizar con cursos existentes en cursos.json (para que aparezcan de inmediato en el grafo)
        const cursos = readJSON('cursos.json', []);
        cursos.forEach(c => {
            pensumGraph.agregarCurso(c.codigo);
        });

        // Escribir los cambios por si se agregaron nuevos cursos del catálogo
        guardarJSON();

        console.log(`¡Grafo de Pensum reconstruido con éxito! Vértices: ${pensumGraph.vertices.length}`);
    } catch (error) {
        console.error('Error al cargar pensum en el grafo:', error.message);
    }
};

// Función auxiliar para guardar cambios
const guardarJSON = () => {
    const estructura = pensumGraph.obtenerEstructura();
    writeJSON('pensum.json', {
        vertices: estructura.nodes,
        edges: estructura.edges
    });
};

// GET /api/pensum
const getPensum = (req, res) => {
    try {
        res.json(pensumGraph.obtenerEstructura());
    } catch (error) {
        res.status(500).json({ message: "Error al obtener mapa de prerrequisitos", error: error.message });
    }
};

// POST /api/pensum/cursos - Agregar vértice
const createCursoVertex = (req, res) => {
    const { codigo } = req.body;
    if (!codigo) {
        return res.status(400).json({ message: "El código de curso es requerido" });
    }

    try {
        pensumGraph.agregarCurso(codigo);
        guardarJSON();
        res.status(201).json({ message: `Vértice ${codigo} agregado con éxito` });
    } catch (error) {
        res.status(500).json({ message: "Error al agregar vértice", error: error.message });
    }
};

// DELETE /api/pensum/cursos/:codigo - Eliminar vértice
const deleteCursoVertex = (req, res) => {
    const { codigo } = req.params;

    try {
        if (!pensumGraph.vertices.includes(codigo)) {
            return res.status(404).json({ message: "El curso no existe en el pensum" });
        }
        pensumGraph.eliminarCurso(codigo);
        guardarJSON();
        res.json({ message: `Vértice ${codigo} y sus aristas asociadas eliminados con éxito` });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar vértice del grafo", error: error.message });
    }
};

// POST /api/pensum/prerrequisitos - Agregar arista
const createPrerrequisito = (req, res) => {
    const { source, target } = req.body; // source es prerrequisito de target

    if (!source || !target) {
        return res.status(400).json({ message: "Los campos 'source' y 'target' son obligatorios" });
    }

    if (source === target) {
        return res.status(400).json({ message: "Un curso no puede ser prerrequisito de sí mismo" });
    }

    try {
        // Verificar que los vértices existan o agregarlos
        pensumGraph.agregarCurso(source);
        pensumGraph.agregarCurso(target);

        // Agregar arista
        pensumGraph.agregarPrerrequisito(source, target);

        // Comprobar si al agregar esta arista creamos un ciclo
        if (pensumGraph.detectarCiclos()) {
            // Revertir
            pensumGraph.eliminarPrerrequisito(source, target);
            return res.status(400).json({ 
                message: "No se puede agregar esta relación. Genera un ciclo de prerrequisitos (dependencia circular)." 
            });
        }

        guardarJSON();
        res.status(201).json({ message: "Prerrequisito agregado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al agregar prerrequisito", error: error.message });
    }
};

// DELETE /api/pensum/prerrequisitos - Eliminar arista
const deletePrerrequisito = (req, res) => {
    const { source, target } = req.body;

    if (!source || !target) {
        return res.status(400).json({ message: "Los campos 'source' y 'target' son obligatorios" });
    }

    try {
        pensumGraph.eliminarPrerrequisito(source, target);
        guardarJSON();
        res.json({ message: "Prerrequisito eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar prerrequisito", error: error.message });
    }
};

// GET /api/pensum/topological-sort - Ordenamiento topológico
const getTopologicalSort = (req, res) => {
    try {
        const orden = pensumGraph.ordenamientoTopologico();
        if (orden.length === 0 && pensumGraph.vertices.length > 0) {
            return res.status(400).json({ message: "No se puede realizar el ordenamiento topológico porque existen ciclos en el pensum." });
        }
        res.json(orden);
    } catch (error) {
        res.status(500).json({ message: "Error al calcular ordenamiento topológico", error: error.message });
    }
};

// GET /api/pensum/detect-cycles - Detección de ciclos
const getDetectCycles = (req, res) => {
    try {
        const hasCycle = pensumGraph.detectarCiclos();
        res.json({ hasCycle });
    } catch (error) {
        res.status(500).json({ message: "Error al detectar ciclos", error: error.message });
    }
};

// GET /api/pensum/shortest-path - Camino más corto
const getShortestPath = (req, res) => {
    const { source, target } = req.query;

    if (!source || !target) {
        return res.status(400).json({ message: "Los parámetros de consulta 'source' y 'target' son obligatorios" });
    }

    try {
        const camino = pensumGraph.caminoMasCorto(source, target);
        if (!camino) {
            return res.status(404).json({ message: `No existe un camino de prerrequisitos de ${source} a ${target}` });
        }
        res.json(camino);
    } catch (error) {
        res.status(500).json({ message: "Error al calcular el camino más corto", error: error.message });
    }
};

// GET /api/pensum/:codigo/prerequisites - Prerrequisitos directos e indirectos
const getCursoPrerequisites = (req, res) => {
    const { codigo } = req.params;

    try {
        if (!pensumGraph.vertices.includes(codigo)) {
            return res.status(404).json({ message: "El curso no existe en el pensum" });
        }
        const prerrequisitos = pensumGraph.obtenerPrerrequisitos(codigo);
        res.json(prerrequisitos);
    } catch (error) {
        res.status(500).json({ message: "Error al consultar prerrequisitos", error: error.message });
    }
};

module.exports = {
    cargarDatosALaEstructura,
    getPensum,
    createCursoVertex,
    deleteCursoVertex,
    createPrerrequisito,
    deletePrerrequisito,
    getTopologicalSort,
    getDetectCycles,
    getShortestPath,
    getCursoPrerequisites
};
