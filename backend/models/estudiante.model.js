const mongoose = require('mongoose');

const estudianteSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido'],
        minlength: [3, 'El nombre debe tener al menos 3 caracteres']
    },
    carnet: {
        type: String,
        required: [true, 'El carné es requerido'],
        unique: true
    },
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        match: [/.+\@.+\..+/, 'Por favor, ingrese un formato de email válido']
    },
    carrera: {
        type: String,
        required: [true, 'La carrera es requerida']
    },
    semestre: {
        type: Number,
        required: [true, 'El semestre es requerido'],
        min: [1, 'El semestre mínimo es 1'],
        max: [12, 'El semestre máximo es 12']
    },
    estado: {
        type: String,
        required: true,
        default: 'Activo'
    }
}, {
    timestamps: true // Esto crea automáticamente campos de fecha de creación y actualización
});

module.exports = mongoose.model('Estudiante', estudianteSchema);