const supabase = require('../supabase');
const EstudiantesLinkedList = require('../services/estudiantes.service');

// Instancia global de la lista (Persistencia en memoria)
const listaEstudiantes = new EstudiantesLinkedList();

// Función para cargar los datos de Supabase a la Lista Enlazada
exports.cargarDatosALista = async () => {
    try {
        const { data: datosDeBD, error } = await supabase.from('estudiantes').select('*');
        if (error) throw error;

        // Limpiamos la lista por si se recarga
        listaEstudiantes.cabeza = null;
        listaEstudiantes._tamano = 0;
        
        datosDeBD.forEach(est => {
            listaEstudiantes.insertarAlFinal(est);
        });
        console.log(`¡Lista Enlazada Simple reconstruida con éxito! Nodos: ${listaEstudiantes.tamano()}`);
    } catch (error) {
        console.error('Error al cargar datos a la lista:', error.message);
    }
};

// GET /api/estudiantes?search=...&page=...&limit=...
exports.getEstudiantes = async (req, res) => {
    try {
        const { search, page = 1, limit = 5 } = req.query;
        
        let query = supabase.from('estudiantes').select('*', { count: 'exact' });

        if (search) {
            query = query.or(`nombre.ilike.%${search}%,carnet.ilike.%${search}%,email.ilike.%${search}%`);
        }

        const start = (page - 1) * limit;
        const end = start + limit - 1;

        const { data: estudiantes, error, count } = await query.range(start, end);

        if (error) throw error;

        res.json({
            estudiantes,
            totalPages: Math.ceil(count / limit),
            currentPage: Number(page),
            totalItems: count
        });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener estudiantes", error: error.message });
    }
};

// POST /api/estudiantes/invertir - Invertir la lista en memoria
exports.invertirLista = (req, res) => {
    if (listaEstudiantes.tamano() === 0) {
        return res.status(400).json({ message: "La lista está vacía" });
    }
    listaEstudiantes.invertir();
    
    res.status(200).json({
        message: "Lista invertida exitosamente in-place",
        data: listaEstudiantes.listarTodos()
    });
};

// POST /api/estudiantes - Crear un nuevo estudiante 
exports.createEstudiante = async (req, res) => {
    try {
        const { data: nuevoEstudiante, error } = await supabase
            .from('estudiantes')
            .insert([req.body])
            .select()
            .single();

        if (error) throw error;

        // Insertamos en la BD y también en nuestra lista
        listaEstudiantes.insertarAlFinal(nuevoEstudiante);
        res.status(201).json(nuevoEstudiante);
    } catch (error) {
        res.status(400).json({ message: "Error al crear", error: error.message });
    }
};

// Actualizar estudiante por Carnet
exports.updateEstudiante = async (req, res) => {
    const { carnet } = req.params; // Viene de la URL
    // Adapté "correo" a "email" y "facultad" a "carrera", "semestre", "estado" para que coincida con tu Angular
    const { nombre, email, carrera, semestre, estado } = req.body; // Vienen del formulario

    try {
        // 1. Actualizar en Supabase (Persistencia)
        const { data, error } = await supabase
            .from('estudiantes')
            .update({ nombre, email, carrera, semestre, estado })
            .eq('carnet', carnet);

        if (error) throw error;

        // 2. ACTUALIZACIÓN EN MEMORIA (Lo que vale puntos)
        // Buscamos el nodo en tu Lista Doblemente Enlazada
        let actual = listaEstudiantes.cabeza;
        let encontrado = false;

        while (actual !== null) {
            // Utilizamos actual.estudiante.carnet (ya que así se llama la propiedad en tu clase Nodo)
            if (actual.estudiante.carnet === carnet) {
                // Modificamos los datos del nodo directamente
                actual.estudiante.nombre = nombre;
                actual.estudiante.email = email;
                actual.estudiante.carrera = carrera;
                actual.estudiante.semestre = semestre;
                actual.estudiante.estado = estado;
                encontrado = true;
                break;
            }
            actual = actual.siguiente;
        }

        if (!encontrado) {
            return res.status(404).json({ msg: 'Estudiante no encontrado en la lista manual' });
        }

        res.json({ msg: 'Estudiante actualizado en DB y Lista Doble', carnet });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar', error: error.message });
    }
};

// DELETE /api/estudiantes/:carnet - Eliminar un estudiante 
exports.deleteEstudiante = async (req, res) => {
    try {
        const { error } = await supabase
            .from('estudiantes')
            .delete()
            .eq('carnet', req.params.carnet);

        if (error) throw error;

        // Eliminar nodo de la Lista Doblemente Enlazada
        const eliminado = listaEstudiantes.eliminarPorCarnet(req.params.carnet);
        if (eliminado) {
            console.log(`Nodo eliminado in-place: ${req.params.carnet}`);
        }

        res.json({ message: "Estudiante eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar", error: error.message });
    }
};