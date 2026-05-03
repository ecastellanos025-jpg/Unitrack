const express = require('express');

const cors = require('cors');
require('dotenv').config();

// 1. Importar las rutas (asegúrate de haber creado el archivo en la carpeta routes)
const estudiantesRoutes = require('./routes/estudiantes.routes');

const app = express();

// 2. Middlewares
// Habilitar CORS es requisito obligatorio para comunicar con Angular [cite: 26]
app.use(cors());
// Permite que el servidor entienda el formato JSON en el cuerpo de las peticiones [cite: 13]
app.use(express.json());

app.use('/api', estudiantesRoutes);

// 3. Traer datos de Supabase y Llenar Lista Enlazada Manual
const { cargarDatosALista } = require('./controllers/estudiante.controller');
cargarDatosALista();

// 4. Montar las rutas
// Todas las peticiones a http://localhost:3000/api/estudiantes irán a tus rutas [cite: 21]
app.use('/api/estudiantes', estudiantesRoutes);

// 5. Escuchar peticiones
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor de Node.js corriendo en puerto ${PORT}`);
});