const Estudiante = require('../models/estudiante.model');

// GET /api/estudiantes?search=...&page=...&limit=...
exports.getEstudiantes = async (req, res) => {
    try {
        const { search, page = 1, limit = 5 } = req.query;
        const query = {};

        // Lógica de búsqueda dinámica [cite: 22, 23]
        if (search) {
            query.$or = [
                { nombre: { $regex: search, $options: 'i' } },
                { carnet: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const estudiantes = await Estudiante.find(query)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Estudiante.countDocuments(query);

        res.json({
            estudiantes,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            totalItems: count
        });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener estudiantes", error });
    }
};

// POST /api/estudiantes - Crear un nuevo estudiante 
exports.createEstudiante = async (req, res) => {
    try {
        const nuevoEstudiante = new Estudiante(req.body);
        await nuevoEstudiante.save();
        res.status(201).json(nuevoEstudiante);
    } catch (error) {
        res.status(400).json({ message: "Error al crear", error: error.message });
    }
};

// PUT /api/estudiantes/:id - Actualizar un estudiante 
exports.updateEstudiante = async (req, res) => {
    try {
        const actualizado = await Estudiante.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        res.json(actualizado);
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar", error: error.message });
    }
};

// DELETE /api/estudiantes/:id - Eliminar un estudiante 
exports.deleteEstudiante = async (req, res) => {
    try {
        await Estudiante.findByIdAndDelete(req.params.id);
        res.json({ message: "Estudiante eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar", error: error.message });
    }
};