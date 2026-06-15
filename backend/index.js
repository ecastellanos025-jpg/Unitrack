const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importar rutas
const estudiantesRoutes = require('./routes/estudiantes.routes');
const cursosRoutes = require('./routes/cursos.routes');
const catedraticosRoutes = require('./routes/catedraticos.routes');
const pensumRoutes = require('./routes/pensum.routes');

const app = express();

// Middlewares
app.use(cors({
    origin: ['http://localhost:4200'], // Solo acepta peticiones del frontend Angular
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Montar las rutas en los endpoints correspondientes
app.use('/api/estudiantes', estudiantesRoutes);
app.use('/api/cursos', cursosRoutes);
app.use('/api/catedraticos', catedraticosRoutes);
app.use('/api/pensum', pensumRoutes);

// Cargar datos en memoria desde los archivos JSON locales (reconstruyendo las estructuras de datos)
const { cargarDatosALista } = require('./controllers/estudiante.controller');
const { cargarDatosALaEstructura: cargarCursos } = require('./controllers/cursos.controller');
const { cargarDatosALaEstructura: cargarCatedraticos } = require('./controllers/catedraticos.controller');
const { cargarDatosALaEstructura: cargarPensum } = require('./controllers/pensum.controller');

try {
    cargarDatosALista();
    cargarCursos();
    cargarCatedraticos();
    cargarPensum();
    console.log('¡Todas las estructuras de datos manuales han sido inicializadas y sincronizadas!');
} catch (error) {
    console.error('Error al inicializar las estructuras de datos:', error.message);
}

// Ruta de prueba base
app.get('/api/health', (req, res) => {
    res.json({ status: "OK", message: "UniTrack API está activa y lista." });
});

// Middleware global para manejo de errores no capturados
// Debe ir DESPUÉS de todas las rutas
app.use((err, req, res, next) => {
    console.error('[Error Global]', err.stack || err.message);
    res.status(err.status || 500).json({
        message: err.message || 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Escuchar peticiones
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de Node.js corriendo en puerto ${PORT}`);
});