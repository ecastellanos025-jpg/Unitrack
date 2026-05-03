# Sistema de Estudiantes

Un sistema completo de gestión de estudiantes con un backend desarrollado en Node.js (Express) y Supabase, y un frontend construido con Angular. El proyecto implementa una estructura de datos de Lista Enlazada (Linked List) personalizada para manejar la lógica de los estudiantes.

## Tecnologías Utilizadas

### Frontend
- **Framework:** Angular 21
- **Estilos:** Bootstrap 5, Bootstrap Icons
- **Alertas:** SweetAlert2

### Backend
- **Entorno:** Node.js
- **Framework:** Express
- **Base de Datos:** Supabase (PostgreSQL)
- **Estructura de Datos:** Lista Enlazada (Linked List)

## Estructura del Proyecto

El repositorio está dividido en dos partes principales:

- `frontend/`: Contiene la aplicación cliente en Angular. Permite visualizar listas, agregar, editar y eliminar estudiantes utilizando una interfaz amigable.
- `backend/`: Contiene el servidor en Node.js. Expone una API RESTful para realizar operaciones CRUD y se conecta a Supabase. La gestión de los estudiantes internamente utiliza una implementación de Listas Enlazadas.

## Requisitos Previos

- Node.js
- Angular CLI (v21+)
- Una cuenta en Supabase con una base de datos configurada.

## Instalación y Configuración

### 1. Configuración del Backend

1. Navega a la carpeta del backend:
   ```bash
   cd backend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Configura las variables de entorno. Crea un archivo `.env` en la raíz de la carpeta `backend/` e incluye tus credenciales de Supabase (revisa los requerimientos del proyecto para los nombres exactos de las variables):
   ```env
   PORT=3000
   SUPABASE_URL=tu_supabase_url
   SUPABASE_KEY=tu_supabase_anon_key
   ```
4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

### 2. Configuración del Frontend

1. Navega a la carpeta del frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Inicia la aplicación Angular:
   ```bash
   npm start
   ```
4. Abre tu navegador y accede a `http://localhost:4200/`.

## Características Principales

- **Gestión Completa CRUD:** Crear, leer, actualizar y eliminar registros de estudiantes.
- **Lista Enlazada Personalizada:** El sistema emplea de forma nativa estructuras de nodos y listas enlazadas.
- **Visualizador de Estructuras:** Interfaz que ilustra las conexiones entre nodos, con opciones de visualización e inversión de la lista de estudiantes.
- **Almacenamiento Seguro:** Persistencia de datos en la nube de forma segura y escalable utilizando Supabase.
