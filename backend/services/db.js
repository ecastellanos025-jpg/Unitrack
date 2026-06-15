const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

// Asegurar que el directorio de datos existe
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

const getFilePath = (fileName) => path.join(DATA_DIR, fileName);

const readJSON = (fileName, defaultValue = []) => {
    const filePath = getFilePath(fileName);
    try {
        if (!fs.existsSync(filePath)) {
            // Escribir el valor por defecto si no existe
            fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2), 'utf-8');
            return defaultValue;
        }
        const content = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        console.error(`Error al leer archivo ${fileName}:`, error.message);
        return defaultValue;
    }
};

const writeJSON = (fileName, data) => {
    const filePath = getFilePath(fileName);
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        return true;
    } catch (error) {
        console.error(`Error al escribir archivo ${fileName}:`, error.message);
        return false;
    }
};

// Seed inicial para estudiantes si está vacío
const seedData = () => {
    const estudiantesFile = 'estudiantes.json';
    const estudiantes = readJSON(estudiantesFile, []);
    if (estudiantes.length === 0) {
        const mockEstudiantes = [
            { carnet: "2023001", nombre: "Carlos Gómez", email: "carlos.gomez@correo.com", carrera: "Ingeniería en Sistemas", semestre: 3, estado: "Activo" },
            { carnet: "2023002", nombre: "Ana Martínez", email: "ana.martinez@correo.com", carrera: "Ingeniería en Sistemas", semestre: 3, estado: "Activo" },
            { carnet: "2023003", nombre: "Luis Rodríguez", email: "luis.rodriguez@correo.com", carrera: "Ingeniería en Sistemas", semestre: 5, estado: "Activo" },
            { carnet: "2022045", nombre: "María López", email: "maria.lopez@correo.com", carrera: "Licenciatura en Informática", semestre: 8, estado: "Activo" }
        ];
        writeJSON(estudiantesFile, mockEstudiantes);
    }

    const cursosFile = 'cursos.json';
    const cursos = readJSON(cursosFile, []);
    if (cursos.length === 0) {
        const mockCursos = [
            { codigo: "101", nombre: "Introducción a la Programación", creditos: 4, catedratico: "EMP001", horario: "07:00-09:00", cupoMaximo: 30 },
            { codigo: "102", nombre: "Estructuras de Datos", creditos: 5, catedratico: "EMP002", horario: "09:00-11:00", cupoMaximo: 25 },
            { codigo: "103", nombre: "Bases de Datos I", creditos: 4, catedratico: "EMP001", horario: "11:00-13:00", cupoMaximo: 30 },
            { codigo: "201", nombre: "Análisis y Diseño I", creditos: 4, catedratico: "EMP003", horario: "14:00-16:00", cupoMaximo: 20 }
        ];
        writeJSON(cursosFile, mockCursos);
    }

    const catedraticosFile = 'catedraticos.json';
    const catedraticos = readJSON(catedraticosFile, []);
    if (catedraticos.length === 0) {
        const mockCatedraticos = [
            { codigoEmpleado: "EMP001", nombre: "Ing. Jorge Pérez", especialidad: "Programación y Algoritmia", email: "jorge.perez@universidad.edu" },
            { codigoEmpleado: "EMP002", nombre: "Dra. Elisa Fuentes", especialidad: "Estructuras de Datos Avanzadas", email: "elisa.fuentes@universidad.edu" },
            { codigoEmpleado: "EMP003", nombre: "MSc. Mario Estrada", especialidad: "Ingeniería de Software", email: "mario.estrada@universidad.edu" }
        ];
        writeJSON(catedraticosFile, mockCatedraticos);
    }

    const pensumFile = 'pensum.json';
    const pensum = readJSON(pensumFile, { vertices: [], edges: [] });
    if (pensum.vertices.length === 0) {
        const mockPensum = {
            vertices: ["101", "102", "103", "201"],
            edges: [
                { source: "101", target: "102" }, // Introducción es prerrequisito de Estructuras
                { source: "101", target: "103" }, // Introducción es prerrequisito de Bases I
                { source: "102", target: "201" }  // Estructuras es prerrequisito de Análisis I
            ]
        };
        writeJSON(pensumFile, mockPensum);
    }

    const inscripcionesFile = 'inscripciones.json';
    const inscripciones = readJSON(inscripcionesFile, []);
    if (inscripciones.length === 0) {
        const mockInscripciones = [
            { carnet: "2023001", curso: "101", semestre: 1, nota: 85, estado: "completada" },
            { carnet: "2023001", curso: "102", semestre: 2, nota: 74, estado: "completada" },
            { carnet: "2023002", curso: "101", semestre: 1, nota: 90, estado: "completada" }
        ];
        writeJSON(inscripcionesFile, mockInscripciones);
    }
};

seedData();

module.exports = {
    readJSON,
    writeJSON
};
