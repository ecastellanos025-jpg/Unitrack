const { readJSON, writeJSON } = require('../services/db');
const EstudiantesSimpleLinkedList = require('../services/estudiantes.service');
const InscripcionesDoubleLinkedList = require('../services/historial.service');

// Instancia global de estudiantes (en memoria para persistir la estructura de datos viva)
const listaEstudiantes = new EstudiantesSimpleLinkedList();

// Cargar datos al iniciar el servidor
const cargarDatosALista = () => {
    try {
        const datos = readJSON('estudiantes.json', []);
        listaEstudiantes.cabeza = null;
        listaEstudiantes._tamano = 0;
        
        datos.forEach(est => {
            listaEstudiantes.insertarAlFinal(est);
        });
        console.log(`¡Lista Enlazada Simple reconstruida con éxito! Estudiantes en memoria: ${listaEstudiantes.tamano()}`);
    } catch (error) {
        console.error('Error al cargar estudiantes en memoria:', error.message);
    }
};

// GET /api/estudiantes
const getEstudiantes = (req, res) => {
    try {
        const { search, page = 1, limit = 5 } = req.query;
        let todos = listaEstudiantes.listarTodos();

        // Aplicar búsqueda local
        if (search) {
            const query = search.toLowerCase();
            todos = todos.filter(e => 
                e.nombre.toLowerCase().includes(query) || 
                e.carnet.toLowerCase().includes(query) || 
                e.email.toLowerCase().includes(query)
            );
        }

        const count = todos.length;
        const start = (Number(page) - 1) * Number(limit);
        const end = start + Number(limit);
        const paginados = todos.slice(start, end);

        res.json({
            estudiantes: paginados,
            totalPages: Math.ceil(count / Number(limit)) || 1,
            currentPage: Number(page),
            totalItems: count
        });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener estudiantes", error: error.message });
    }
};

// GET /api/estudiantes/:carnet
const buscarEstudiante = (req, res) => {
    const { carnet } = req.params;
    const nodo = listaEstudiantes.buscarPorCarnet(carnet);
    if (!nodo) {
        return res.status(404).json({ message: "Estudiante no encontrado" });
    }
    res.json(nodo.estudiante);
};

// POST /api/estudiantes
const createEstudiante = (req, res) => {
    try {
        const { carnet, nombre, email, carrera, semestre, estado = "Activo" } = req.body;
        if (!carnet || !nombre || !email) {
            return res.status(400).json({ message: "El carné, nombre y correo son obligatorios" });
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "El formato del correo electrónico no es válido" });
        }
        // Verificar duplicado
        if (listaEstudiantes.buscarPorCarnet(carnet)) {
            return res.status(400).json({ message: `El estudiante con carné ${carnet} ya está registrado` });
        }

        const nuevoEstudiante = { carnet, nombre, email, carrera, semestre: Number(semestre), estado };
        
        // Insertar en la lista en memoria (al final)
        listaEstudiantes.insertarAlFinal(nuevoEstudiante);

        // Guardar la lista entera en el archivo JSON
        writeJSON('estudiantes.json', listaEstudiantes.listarTodos());

        res.status(201).json(nuevoEstudiante);
    } catch (error) {
        res.status(500).json({ message: "Error al crear estudiante", error: error.message });
    }
};

// PUT /api/estudiantes/:carnet
const updateEstudiante = (req, res) => {
    const { carnet } = req.params;
    const { nombre, email, carrera, semestre, estado } = req.body;

    try {
        const nodo = listaEstudiantes.buscarPorCarnet(carnet);
        if (!nodo) {
            return res.status(404).json({ message: "Estudiante no encontrado" });
        }

        // Modificar los datos del nodo
        if (nombre) nodo.estudiante.nombre = nombre;
        if (email) nodo.estudiante.email = email;
        if (carrera) nodo.estudiante.carrera = carrera;
        if (semestre) nodo.estudiante.semestre = Number(semestre);
        if (estado) nodo.estudiante.estado = estado;

        // Guardar cambios
        writeJSON('estudiantes.json', listaEstudiantes.listarTodos());

        res.json({ message: "Estudiante actualizado correctamente", estudiante: nodo.estudiante });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar estudiante", error: error.message });
    }
};

// DELETE /api/estudiantes/:carnet
const deleteEstudiante = (req, res) => {
    const { carnet } = req.params;
    try {
        const eliminado = listaEstudiantes.eliminarPorCarnet(carnet);
        if (!eliminado) {
            return res.status(404).json({ message: "Estudiante no encontrado" });
        }

        // Guardar cambios
        writeJSON('estudiantes.json', listaEstudiantes.listarTodos());

        // Eliminar inscripciones asociadas
        const inscripciones = readJSON('inscripciones.json', []);
        const filtradas = inscripciones.filter(ins => ins.carnet !== carnet);
        writeJSON('inscripciones.json', filtradas);

        res.json({ message: "Estudiante e inscripciones eliminados correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar estudiante", error: error.message });
    }
};

// POST /api/estudiantes/invertir
const invertirLista = (req, res) => {
    try {
        if (listaEstudiantes.tamano() === 0) {
            return res.status(400).json({ message: "La lista está vacía" });
        }
        
        // Invertir la estructura en memoria
        listaEstudiantes.invertir();
        
        // Guardar la nueva secuencia en el archivo JSON
        writeJSON('estudiantes.json', listaEstudiantes.listarTodos());

        res.json({
            message: "Lista invertida exitosamente in-place en memoria",
            data: listaEstudiantes.listarTodos()
        });
    } catch (error) {
        res.status(500).json({ message: "Error al invertir la lista", error: error.message });
    }
};

// --- ENDPOINTS PARA HISTORIAL DE INSCRIPCIONES (Lista Doblemente Enlazada) ---

// GET /api/estudiantes/:carnet/historial
const getHistorial = (req, res) => {
    const { carnet } = req.params;
    const { sort, order } = req.query; // sort: semestre o nota; order: asc o desc

    try {
        // Cargar todas las inscripciones del JSON
        const todasInscripciones = readJSON('inscripciones.json', []);
        
        // Filtrar las del estudiante
        const delEstudiante = todasInscripciones.filter(ins => ins.carnet === carnet);

        // Crear una instancia de la lista doblemente enlazada
        const dll = new InscripcionesDoubleLinkedList();
        delEstudiante.forEach(ins => dll.insertarAlFinal(ins));

        // Aplicar ordenamiento manual si se especifica
        if (sort === 'semestre') {
            dll.ordenarPorSemestre();
        } else if (sort === 'nota') {
            dll.ordenarPorNota();
        }

        // Retornar en el orden deseado (adelante o atrás)
        const resultado = (order === 'desc') ? dll.listarInverso() : dll.listarTodos();

        res.json(resultado);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener historial de inscripciones", error: error.message });
    }
};

// POST /api/estudiantes/:carnet/historial
const createInscripcion = (req, res) => {
    const { carnet } = req.params;
    const { curso, semestre, nota, estado = "activa" } = req.body;

    if (!curso || !semestre || nota === undefined) {
        return res.status(400).json({ message: "Curso, semestre y nota son obligatorios" });
    }

    try {
        // Verificar que el estudiante existe
        if (!listaEstudiantes.buscarPorCarnet(carnet)) {
            return res.status(404).json({ message: "Estudiante no encontrado" });
        }

        const todasInscripciones = readJSON('inscripciones.json', []);
        
        // Evitar duplicados del mismo curso
        const yaInscrito = todasInscripciones.some(ins => ins.carnet === carnet && ins.curso === curso);
        if (yaInscrito) {
            return res.status(400).json({ message: "El estudiante ya cuenta con una inscripción para este curso" });
        }

        const nuevaInscripcion = {
            carnet,
            curso,
            semestre: Number(semestre),
            nota: Number(nota),
            estado
        };

        // Agregar al JSON
        todasInscripciones.push(nuevaInscripcion);
        writeJSON('inscripciones.json', todasInscripciones);

        res.status(201).json(nuevaInscripcion);
    } catch (error) {
        res.status(500).json({ message: "Error al registrar inscripción", error: error.message });
    }
};

// DELETE /api/estudiantes/:carnet/historial/:curso
const deleteInscripcion = (req, res) => {
    const { carnet, curso } = req.params;

    try {
        const todasInscripciones = readJSON('inscripciones.json', []);
        const longitudOriginal = todasInscripciones.length;
        
        const filtradas = todasInscripciones.filter(ins => !(ins.carnet === carnet && ins.curso === curso));
        
        if (filtradas.length === longitudOriginal) {
            return res.status(404).json({ message: "Inscripción no encontrada" });
        }

        writeJSON('inscripciones.json', filtradas);
        res.json({ message: "Inscripción eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar inscripción", error: error.message });
    }
};

module.exports = {
    cargarDatosALista,
    getEstudiantes,
    buscarEstudiante,
    createEstudiante,
    updateEstudiante,
    deleteEstudiante,
    invertirLista,
    getHistorial,
    createInscripcion,
    deleteInscripcion
};