# UniTrack – Plataforma Integral de Gestión Universitaria

> **Universidad Regional de Guatemala** | Curso: Estructura de Datos

[![Angular](https://img.shields.io/badge/Angular-21-DD0031?logo=angular)](https://angular.io/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## Índice

1. [Descripción General](#1-descripción-general)
2. [Arquitectura del Sistema](#2-arquitectura-del-sistema)
3. [Stack Tecnológico](#3-stack-tecnológico)
4. [Instalación y Ejecución](#4-instalación-y-ejecución)
5. [Estructuras de Datos Implementadas](#5-estructuras-de-datos-implementadas)
6. [Análisis de Complejidad Big-O](#6-análisis-de-complejidad-big-o)
7. [API REST – Endpoints](#7-api-rest--endpoints)
8. [Módulos del Frontend](#8-módulos-del-frontend)
9. [Persistencia de Datos](#9-persistencia-de-datos)

---

## 1. Descripción General

**UniTrack** es una plataforma web de gestión universitaria que administra estudiantes, catedráticos, cursos, pensum académico e inscripciones. Su objetivo central es demostrar la implementación práctica de las principales estructuras de datos: **Listas Enlazadas, Listas Doblemente Enlazadas, Árboles BST y AVL, Tablas Hash y Grafos Dirigidos**.

> ⚠️ **Restricción de implementación:** Todas las estructuras de datos fueron implementadas manualmente como clases propias en JavaScript. No se utilizó ninguna librería externa que las provea de forma prediseñada.

---

## 2. Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────┐
│                  FRONTEND (Angular 21)               │
│                                                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐  │
│  │Estudiantes│ │  Cursos  │ │Catedrátic│ │Pensum  │  │
│  │ Fase 1   │ │  Fase 2  │ │  Fase 3  │ │ Fase 4 │  │
│  │Lista LL  │ │ BST/AVL  │ │TablaHash │ │ Grafo  │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └───┬────┘  │
│       │            │            │            │       │
│       └────────────┴──── API HTTP ───────────┘       │
└─────────────────────────────────────────────────────┘
                          │ REST (JSON)
                          ▼
┌─────────────────────────────────────────────────────┐
│               BACKEND (Node.js + Express)            │
│                                                      │
│  ┌──────────────────────────────────────────────┐    │
│  │              Capa de Rutas (Routes)           │    │
│  │  /api/estudiantes  /api/cursos               │    │
│  │  /api/catedraticos /api/pensum               │    │
│  └──────────────────┬───────────────────────────┘    │
│                     │                                │
│  ┌──────────────────▼───────────────────────────┐    │
│  │            Capa de Controladores             │    │
│  └──────────────────┬───────────────────────────┘    │
│                     │                                │
│  ┌──────────────────▼───────────────────────────┐    │
│  │          Capa de Servicios (Estructuras)      │    │
│  │                                              │    │
│  │  EstudiantesSimpleLinkedList                 │    │
│  │  InscripcionesDoubleLinkedList               │    │
│  │  CursosTree (BST + AVL)                      │    │
│  │  CatedraticosHashTable                       │    │
│  │  PensumGraph (Grafo Dirigido)                │    │
│  └──────────────────┬───────────────────────────┘    │
│                     │                                │
│  ┌──────────────────▼───────────────────────────┐    │
│  │            Persistencia (JSON files)          │    │
│  │  estudiantes.json  cursos.json               │    │
│  │  catedraticos.json pensum.json               │    │
│  └──────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

### Patrón Arquitectónico del Backend

```
Routes → Controllers → Services (Estructuras de Datos) → db.js (JSON)
```

| Capa        | Responsabilidad                                              |
|-------------|--------------------------------------------------------------|
| `routes/`   | Definición de endpoints REST y métodos HTTP                  |
| `controllers/` | Lógica de negocio, validaciones y respuestas HTTP        |
| `services/` | Implementación pura de estructuras de datos                  |
| `db.js`     | Utilidades de lectura/escritura de archivos JSON             |

---

## 3. Stack Tecnológico

### Frontend
| Tecnología | Versión | Uso |
|---|---|---|
| Angular | 21+ | Framework SPA |
| TypeScript | 5.x | Tipado estático |
| Bootstrap | 5.x | Sistema de grillas y componentes UI |
| Bootstrap Icons | 1.x | Iconografía |
| SweetAlert2 | Latest | Diálogos interactivos |
| SVG nativo | — | Visualización de árboles y grafos |

### Backend
| Tecnología | Versión | Uso |
|---|---|---|
| Node.js | 18+ | Entorno de ejecución |
| Express.js | 4.x | Framework HTTP |
| dotenv | 17.x | Variables de entorno |
| cors | 2.x | Cross-Origin Resource Sharing |

---

## 4. Instalación y Ejecución

### Prerrequisitos
- Node.js v18 o superior
- Angular CLI v21 o superior
- Git

### Clonar el repositorio
```bash
git clone https://github.com/ecastellanos025-jpg/Unitrack.git
cd Unitrack
```

### Configuración del Backend

```bash
cd backend
npm install
```

Crear el archivo `.env` en la carpeta `backend/`:
```env
PORT=3000
NODE_ENV=development
```

Iniciar el servidor de desarrollo:
```bash
npm run dev
```

> El servidor iniciará en `http://localhost:3000`. Al arrancar, se crean automáticamente los archivos JSON en `backend/data/` y se inicializan todas las estructuras de datos en memoria.

### Configuración del Frontend

```bash
cd frontend
npm install
npm start
```

Abrir el navegador en: **`http://localhost:4200`**

---

## 5. Estructuras de Datos Implementadas

### 5.1 Lista Enlazada Simple — `EstudiantesSimpleLinkedList`
**Archivo:** `backend/services/estudiantes.service.js`

Gestiona los registros de estudiantes. Cada `NodoEstudiante` almacena los datos del estudiante y un puntero `siguiente` al próximo nodo.

```
cabeza
  │
  ▼
┌──────────┐   ┌──────────┐   ┌──────────┐
│ 2023001  │ → │ 2023002  │ → │ 2023003  │ → NULL
│ C. Gómez │   │ A. Martín│   │ L. Rodrí.│
└──────────┘   └──────────┘   └──────────┘
```

**Operaciones implementadas:**
- `insertarAlInicio(estudiante)` — O(1)
- `insertarAlFinal(estudiante)` — O(n)
- `insertarEnPosicion(indice, estudiante)` — O(n)
- `eliminarPorCarnet(carnet)` — O(n)
- `buscarPorCarnet(carnet)` — O(n)
- `listarTodos()` — O(n)
- `invertir()` — O(n) in-place, sin memoria auxiliar
- `tamano()` — O(1)

---

### 5.2 Lista Doblemente Enlazada — `InscripcionesDoubleLinkedList`
**Archivo:** `backend/services/historial.service.js`

Gestiona el historial de inscripciones de cada estudiante. Cada `NodoInscripcion` tiene punteros `siguiente` y `anterior`, permitiendo navegación bidireccional.

```
              cabeza                              cola
                │                                 │
                ▼                                 ▼
NULL ← ┌──────────────┐ ⇄ ┌──────────────┐ ⇄ ┌──────────────┐ → NULL
       │ Sem: 1 / 101 │   │ Sem: 2 / 103 │   │ Sem: 3 / 201 │
       │ Nota: 85     │   │ Nota: 92     │   │ Nota: 78     │
       └──────────────┘   └──────────────┘   └──────────────┘
```

**Operaciones implementadas:**
- `insertarAlInicio(inscripcion)` — O(1)
- `insertarAlFinal(inscripcion)` — O(1)
- `eliminarPorCurso(codigo)` — O(n)
- `buscarPorCursoOSemestre(query)` — O(n)
- `ordenarPorSemestre()` — O(n²) Bubble Sort in-place sobre la DLL
- `ordenarPorNota()` — O(n²) Bubble Sort in-place sobre la DLL
- `listarTodos()` — O(n) recorrido adelante
- `listarInverso()` — O(n) recorrido usando punteros `anterior`

---

### 5.3 Árbol BST y AVL — `CursosTree`
**Archivo:** `backend/services/cursos.service.js`

Un único árbol que soporta dos modos de inserción: BST (sin balanceo) y AVL (con rotaciones automáticas). El código del curso (string alfanumérico) es la clave de ordenamiento.

**Árbol AVL de ejemplo:**
```
              102 (FB:-1, H:3)
             /               \
       101 (FB:0, H:1)   103 (FB:-1, H:2)
                                   \
                              201 (FB:0, H:1)
```

**Rotaciones AVL implementadas:**
- Rotación simple derecha (caso Izquierda-Izquierda)
- Rotación simple izquierda (caso Derecha-Derecha)
- Rotación doble Izquierda-Derecha
- Rotación doble Derecha-Izquierda

**Operaciones implementadas:**
- `insertarBST(curso)` — O(n) caso peor, O(log n) promedio
- `insertarAVL(curso)` — O(log n) garantizado
- `eliminar(codigo)` — O(log n) con rebalanceo
- `buscar(codigo)` — O(log n)
- `inOrden()` — O(n) — devuelve cursos en orden ascendente
- `preOrden()` — O(n)
- `postOrden()` — O(n)
- `encontrarMinimo()` — O(log n)
- `encontrarMaximo()` — O(log n)
- `obtenerAlturaTotal()` — O(1)
- `obtenerFormatoGrafico()` — O(n) — serializa árbol con FB para SVG

---

### 5.4 Tabla Hash — `CatedraticosHashTable`
**Archivo:** `backend/services/catedraticos.service.js`

Almacena catedráticos usando su código de empleado como clave. Implementa **3 funciones hash** y **3 métodos de resolución de colisiones**, seleccionables desde la UI.

**Funciones Hash:**

| Nombre | Fórmula | Descripción |
|---|---|---|
| División | `h(k) = k mod N` | Método clásico. Sensible a la distribución de claves. |
| Multiplicación | `h(k) = floor(N * frac(k * A))` | A = 0.6180339887 (razón áurea). Mejor distribución. |
| DJB2 | `h = ((h << 5) + h) + charCode` | Algoritmo polinomial. Excelente para strings. |

**Métodos de Resolución de Colisiones:**

| Método | Descripción | Visualización |
|---|---|---|
| Encadenamiento (*Chaining*) | Lista enlazada por bucket. Sin límite de elementos. | `[3] → EMP001 → EMP005 → NULL` |
| Probing Lineal | `h(k,i) = (h(k) + i) mod N` | Celda siguiente libre |
| Probing Cuadrático | `h(k,i) = (h(k) + i²) mod N` | Evita clustering primario |

**Operaciones implementadas:**
- `insertar(key, value)` — O(1) promedio, O(n) peor caso
- `buscar(key)` — O(1) promedio
- `eliminar(key)` — O(1) promedio con *Tombstone* en probing
- `obtenerFactorCarga()` — O(1)
- `_rehash(newCapacity)` — O(n) — se dispara al superar λ = 0.75
- `configurar(hashType, collisionMethod)` — O(n) — reconstruye la tabla
- `obtenerEstadoBuckets()` — O(n) — serializa el estado para la UI

---

### 5.5 Grafo Dirigido — `PensumGraph`
**Archivo:** `backend/services/pensum.service.js`

Grafo Dirigido Acíclico (DAG) donde cada vértice es un curso y cada arista dirigida `A → B` representa que **A es prerrequisito de B**. Usa **Lista de Adyacencia** como representación interna.

**Ejemplo de estructura:**
```
101 (Intro) ──→ 103 (Bases de Datos) ──→ 201 (Análisis I)
     │
     └──────────────────────────────────→ 202 (Algoritmos)
```

**Algoritmos implementados:**

| Algoritmo | Técnica | Complejidad |
|---|---|---|
| BFS | Cola FIFO + array de visitados | O(V + E) |
| DFS | Recursión + array de visitados | O(V + E) |
| Detección de Ciclos | DFS con 3 colores (Blanco/Gris/Negro) | O(V + E) |
| Ordenamiento Topológico | Algoritmo de Kahn (BFS con in-degree) | O(V + E) |
| Camino Más Corto | BFS con reconstrucción de predecesores | O(V + E) |
| Prerrequisitos Directos/Indirectos | Grafo invertido + DFS | O(V + E) |

> **Invariante de integridad:** Cada vez que se agrega una arista, se verifica inmediatamente que no crea un ciclo. Si lo crea, la arista es revertida y se retorna error HTTP 400.

---

## 6. Análisis de Complejidad Big-O

### 6.1 Resumen por Estructura

| Estructura | Operación | Mejor | Promedio | Peor | Espacio |
|---|---|---|---|---|---|
| **Lista Enlazada Simple** | Insertar inicio | O(1) | O(1) | O(1) | O(1) |
| | Insertar final / posición | O(n) | O(n) | O(n) | O(1) |
| | Buscar / Eliminar | O(1) | O(n/2) | O(n) | O(1) |
| | Invertir | O(n) | O(n) | O(n) | O(1) |
| | Listar todos | O(n) | O(n) | O(n) | O(n) |
| **Lista Doblemente Enlazada** | Insertar inicio/final | O(1) | O(1) | O(1) | O(1) |
| | Insertar mitad / Buscar | O(n) | O(n) | O(n) | O(1) |
| | Eliminar (nodo conocido) | O(1) | O(1) | O(1) | O(1) |
| | Ordenar (Bubble Sort) | O(n) | O(n²) | O(n²) | O(1) |
| | Recorrido inverso | O(n) | O(n) | O(n) | O(n) |
| **BST** | Insertar / Buscar | O(log n) | O(log n) | O(n) | O(h) |
| | Eliminar | O(log n) | O(log n) | O(n) | O(h) |
| | Recorridos | O(n) | O(n) | O(n) | O(h) |
| **AVL** | Insertar / Buscar | O(log n) | O(log n) | O(log n) | O(log n) |
| | Eliminar | O(log n) | O(log n) | O(log n) | O(log n) |
| | Rotaciones | O(1) | O(1) | O(1) | O(1) |
| **Tabla Hash** | Insertar | O(1) | O(1) | O(n) | O(1) |
| | Buscar | O(1) | O(1) | O(n) | O(1) |
| | Eliminar | O(1) | O(1) | O(n) | O(1) |
| | Rehashing | O(n) | O(n) | O(n) | O(n) |
| **Grafo Dirigido** | BFS / DFS | O(V+E) | O(V+E) | O(V+E) | O(V) |
| | Topológico (Kahn) | O(V+E) | O(V+E) | O(V+E) | O(V) |
| | Detección ciclos | O(V+E) | O(V+E) | O(V+E) | O(V) |
| | Camino más corto | O(V+E) | O(V+E) | O(V+E) | O(V) |

> **Notación:** n = número de elementos, h = altura del árbol, V = vértices, E = aristas.

### 6.2 Análisis Detallado: Árbol AVL vs BST

**¿Por qué AVL es superior a BST en el peor caso?**

Un BST degenerado (inserción de claves ordenadas) se convierte en una lista enlazada:
```
Inserción BST ordenada: 101 → 102 → 103 → 201
101
  \
  102
     \
     103
        \
        201    ← altura = n, búsqueda = O(n)
```

El AVL **garantiza** `h ≤ 1.44 log₂(n+2)`, por lo que siempre:
- Búsqueda: O(log n) garantizado
- El rebalanceo cuesta máximo O(log n) rotaciones por inserción

### 6.3 Análisis Detallado: Tabla Hash

**Factor de carga λ = n/N** (elementos / capacidad):

| λ | Estado | Rendimiento |
|---|---|---|
| < 0.50 | Óptimo | Muy pocas colisiones |
| 0.50 – 0.75 | Aceptable | Colisiones ocasionales |
| ≥ 0.75 | Umbral de rehashing | **Rehashing automático** a N×2+1 |

**Rehashing:** Al duplicar la capacidad, el tiempo amortizado de inserción es **O(1)** aunque el rehash individual sea O(n).

### 6.4 Análisis Detallado: Grafo Dirigido

**Representación:** Lista de Adyacencia  
- Espacio: O(V + E) vs O(V²) de la matriz de adyacencia
- Mejor para grafos dispersos (pocas aristas relativas a vértices)

**Detección de Ciclos — Algoritmo de 3 colores:**
```
Blanco (0) → no visitado
Gris   (1) → en proceso (en la pila de recursión actual)
Negro  (2) → completamente visitado

Si al visitar un vecino este es GRIS → hay ciclo (arista de retroceso)
```
Complejidad: O(V + E) — cada vértice y arista se procesan exactamente una vez.

**Ordenamiento Topológico — Algoritmo de Kahn:**
```
1. Calcular in-degree de todos los vértices: O(V + E)
2. Encolar vértices con in-degree = 0: O(V)
3. Procesar cola, decrementar in-degree de vecinos: O(V + E)
4. Si resultado tiene todos los vértices → no hay ciclos
```

---

## 7. API REST – Endpoints

### Módulo Estudiantes (Lista Enlazada Simple)

| Método | Endpoint | Descripción | Big-O |
|---|---|---|---|
| GET | `/api/estudiantes` | Listar todos (recorrido completo LL) | O(n) |
| GET | `/api/estudiantes/:carnet` | Buscar por carnet (búsqueda lineal) | O(n) |
| POST | `/api/estudiantes` | Insertar nuevo estudiante | O(1)/O(n) |
| PUT | `/api/estudiantes/:carnet` | Actualizar datos | O(n) |
| DELETE | `/api/estudiantes/:carnet` | Eliminar de la lista | O(n) |
| GET | `/api/estudiantes/invertir` | Invertir la lista in-place | O(n) |
| GET | `/api/estudiantes/:carnet/historial` | Historial (DLL) del estudiante | O(n) |
| POST | `/api/estudiantes/:carnet/historial` | Agregar inscripción al historial | O(1) |
| DELETE | `/api/estudiantes/:carnet/historial/:curso` | Eliminar inscripción | O(n) |
| GET | `/api/estudiantes/:carnet/historial/inverso` | Historial en orden inverso | O(n) |
| GET | `/api/estudiantes/:carnet/historial/ordenar/:campo` | Ordenar historial (semestre/nota) | O(n²) |

### Módulo Cursos (BST + AVL)

| Método | Endpoint | Descripción | Big-O |
|---|---|---|---|
| GET | `/api/cursos` | Listar todos (InOrden del árbol) | O(n) |
| POST | `/api/cursos` | Insertar curso (BST o AVL según parámetro) | O(log n) |
| DELETE | `/api/cursos/:codigo` | Eliminar por código (con rebalanceo) | O(log n) |
| GET | `/api/cursos/inorden` | Recorrido InOrden (orden ascendente) | O(n) |
| GET | `/api/cursos/preorden` | Recorrido PreOrden | O(n) |
| GET | `/api/cursos/postorden` | Recorrido PostOrden | O(n) |
| GET | `/api/cursos/stats` | Estadísticas: altura, mínimo, máximo | O(log n) |
| GET | `/api/cursos/grafico` | Árbol serializado con factores de balance | O(n) |

### Módulo Catedráticos (Tabla Hash)

| Método | Endpoint | Descripción | Big-O |
|---|---|---|---|
| GET | `/api/catedraticos` | Listar todos + estado de buckets | O(n) |
| GET | `/api/catedraticos/stats` | Factor de carga, colisiones, capacidad | O(1) |
| GET | `/api/catedraticos/:codigo` | Búsqueda directa por clave hash | O(1) prom. |
| POST | `/api/catedraticos` | Insertar en tabla hash | O(1) prom. |
| DELETE | `/api/catedraticos/:codigo` | Eliminar (Tombstone en probing) | O(1) prom. |
| POST | `/api/catedraticos/config` | Cambiar función hash / método colisión | O(n) |

### Módulo Pensum (Grafo Dirigido)

| Método | Endpoint | Descripción | Big-O |
|---|---|---|---|
| GET | `/api/pensum` | Obtener estructura completa (V + E) | O(V+E) |
| POST | `/api/pensum/cursos` | Agregar vértice (curso) al grafo | O(1) |
| DELETE | `/api/pensum/cursos/:codigo` | Eliminar vértice y sus aristas | O(V+E) |
| POST | `/api/pensum/prerrequisitos` | Agregar arista con validación de ciclos | O(V+E) |
| DELETE | `/api/pensum/prerrequisitos` | Eliminar arista | O(E) |
| GET | `/api/pensum/topological-sort` | Ordenamiento topológico (Kahn) | O(V+E) |
| GET | `/api/pensum/detect-cycles` | Detección de ciclos (DFS 3 colores) | O(V+E) |
| GET | `/api/pensum/shortest-path?source=X&target=Y` | Camino más corto (BFS) | O(V+E) |
| GET | `/api/pensum/:codigo/prerequisites` | Prerrequisitos directos e indirectos | O(V+E) |

---

## 8. Módulos del Frontend

### Fase 1 — Estudiantes (Lista Enlazada Simple)
- **Ruta:** `/`
- Visualización gráfica de la lista como cadena de nodos `→`
- CRUD completo con formularios validados
- Botón de inversión in-place con actualización visual
- Historial de inscripciones (DLL) por estudiante con flechas bidireccionales `⇄`

### Fase 2 — Cursos (BST + AVL)
- **Ruta:** `/cursos`
- Toggle entre modo BST y AVL
- Árbol dibujado en SVG con conexiones padre-hijo
- Factor de Balance (FB) y Altura (H) por nodo en tiempo real
- Recorridos InOrden, PreOrden, PostOrden con visualización en badges
- Estadísticas: altura total, nodo mínimo y máximo

### Fase 3 — Catedráticos (Tabla Hash)
- **Ruta:** `/catedraticos`
- Selector de función hash: División, Multiplicación, DJB2
- Selector de colisión: Chaining, Probing Lineal, Probing Cuadrático
- Visualización de buckets en tiempo real:
  - **Chaining:** `[índice] → Nodo1 → Nodo2 → NULL`
  - **Open Addressing:** tarjetas con colores (Libre / Ocupado / ⊗ Tombstone)
- Barra visual de factor de carga con colores (verde/amarillo/rojo)
- Búsqueda O(1) por código de empleado

### Fase 4 — Pensum (Grafo Dirigido)
- **Ruta:** `/pensum`
- Diagrama SVG interactivo con nodos arrastrables
- Flechas dirigidas con colores según algoritmo activo (BFS=naranja, DFS=amarillo, camino=verde)
- Animación BFS y DFS paso a paso con intervalo de 800ms
- Clic en nodo → resalta prerrequisitos directos (naranja) e indirectos (amarillo)
- Indicador de estado DAG vs ciclo detectado
- Lista de Ordenamiento Topológico numerada (Kahn's Algorithm)
- Tabla de aristas activas con eliminación individual

---

## 9. Persistencia de Datos

El sistema utiliza archivos JSON locales para persistencia. Al iniciar el servidor, cada estructura de datos se reconstruye en memoria desde estos archivos:

| Archivo | Estructura reconstruida | Clase |
|---|---|---|
| `backend/data/estudiantes.json` | Lista Enlazada Simple | `EstudiantesSimpleLinkedList` |
| `backend/data/cursos.json` | Árbol AVL | `CursosTree` |
| `backend/data/catedraticos.json` | Tabla Hash | `CatedraticosHashTable` |
| `backend/data/pensum.json` | Grafo Dirigido | `PensumGraph` |
| `backend/data/historial.json` | Listas Doblemente Enlazadas (por carnet) | `InscripcionesDoubleLinkedList` |

> La carpeta `backend/data/` está incluida en `.gitignore` para no versionar datos de prueba.

---

## Autores

- **Emili Castellanos** — Universidad Regional de Guatemala
- Curso: Estructura de Datos — 2026
