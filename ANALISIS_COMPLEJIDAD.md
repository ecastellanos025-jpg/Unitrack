# Análisis de Complejidad Algorítmica — UniTrack

**Universidad Regional de Guatemala**
**Curso:** Estructura de Datos
**Proyecto Final:** Sistema de Gestión Académica UniTrack
**Tecnologías:** Angular 21 + Node.js + Express

---

## Convenciones

| Símbolo | Significado |
|---------|-------------|
| `n` | Número de elementos en la estructura |
| `h` | Altura del árbol |
| `N` | Capacidad (buckets) de la tabla hash |
| `V` | Número de vértices del grafo |
| `E` | Número de aristas del grafo |
| `k` | Número de elementos en la cadena (chaining) de un bucket |

---

## Fase 1 — Lista Enlazada Simple (Módulo: Estudiantes)

La lista enlazada simple almacena estudiantes como nodos encadenados con un único puntero `siguiente`. No hay acceso aleatorio; todas las operaciones de búsqueda requieren recorrido lineal.

### Operaciones

| Operación | Complejidad Temporal | Complejidad Espacial | Justificación |
|-----------|---------------------|----------------------|---------------|
| Insertar al final (`insertarAlFinal`) | **O(n)** | O(1) | Debe recorrer hasta el último nodo |
| Insertar al inicio | **O(1)** | O(1) | Solo reasigna el puntero `cabeza` |
| Buscar por carné (`buscarPorCarnet`) | **O(n)** | O(1) | Recorrido secuencial en el peor caso |
| Eliminar por carné (`eliminarPorCarnet`) | **O(n)** | O(1) | Buscar + reenlazar punteros |
| Listar todos (`listarTodos`) | **O(n)** | O(n) | Recorre toda la lista y genera arreglo |
| Invertir lista (`invertir`) | **O(n)** | O(1) | Recorre una vez invirtiendo punteros in-place |
| Obtener tamaño (`tamano`) | **O(1)** | O(1) | Se mantiene contador actualizado |
| Búsqueda con filtro (paginación) | **O(n)** | O(p) | `p` = elementos por página |

### Caso de uso real
La búsqueda de estudiantes (`GET /api/estudiantes?search=X`) aplica filtro lineal sobre la lista en memoria, lo cual es correcto para conjuntos pequeños/medianos. Para producción con millones de registros se recomendaría un índice.

---

## Fase 1 — Lista Doblemente Enlazada (Módulo: Historial de Inscripciones)

Cada nodo de inscripción contiene punteros `siguiente` y `anterior`, permitiendo recorrido bidireccional. Cada estudiante tiene su propia sub-lista dentro del arreglo JSON.

### Operaciones

| Operación | Complejidad Temporal | Complejidad Espacial | Justificación |
|-----------|---------------------|----------------------|---------------|
| Insertar al final | **O(n)** | O(1) | Sin puntero de cola, debe llegar al último nodo |
| Insertar al inicio | **O(1)** | O(1) | Reasigna `cabeza` y actualiza `anterior` |
| Eliminar por código de curso | **O(n)** | O(1) | Búsqueda lineal + reenlace bidireccional |
| Buscar por código o semestre | **O(n)** | O(1) | Recorrido secuencial |
| Listar hacia adelante | **O(n)** | O(n) | Recorre todos los nodos |
| Listar en orden inverso (`listarInverso`) | **O(n)** | O(n) | Recorre desde el último nodo hacia atrás |
| Navegar nodo a nodo (← →) | **O(1)** | O(1) | Acceso directo por índice en arreglo generado |
| Ordenar por semestre (Bubble Sort) | **O(n²)** | O(1) | Algoritmo sobre la lista enlazada |
| Ordenar por nota (Bubble Sort) | **O(n²)** | O(1) | Intercambio de valores en nodos |

### Nota sobre el ordenamiento
Se implementó **Bubble Sort** directamente sobre la lista enlazada. Aunque O(n²) no es óptimo para grandes volúmenes, cumple con el requisito de implementar el algoritmo *sobre la estructura*, demostrando el manejo de punteros bidireccionales.

---

## Fase 2 — Árbol Binario de Búsqueda BST (Módulo: Catálogo de Cursos)

El árbol BST organiza cursos por código. Para un árbol balanceado la altura `h = O(log n)`, pero en el peor caso degenerado (inserción ordenada) `h = O(n)`.

### Operaciones BST

| Operación | Caso Promedio | Peor Caso | Espacio | Justificación |
|-----------|--------------|-----------|---------|---------------|
| Insertar (`insertarBST`) | **O(log n)** | O(n) | O(h) | Desciende por el árbol comparando claves |
| Buscar por código | **O(log n)** | O(n) | O(h) | Búsqueda binaria recursiva |
| Eliminar por código | **O(log n)** | O(n) | O(h) | Buscar + reemplazar con sucesor in-orden |
| Recorrido InOrden | **O(n)** | O(n) | O(n) | Visita los `n` nodos exactamente una vez |
| Recorrido PreOrden | **O(n)** | O(n) | O(n) | Ídem |
| Recorrido PostOrden | **O(n)** | O(n) | O(n) | Ídem |
| Encontrar mínimo | **O(log n)** | O(n) | O(h) | Sigue el camino izquierdo hasta la hoja |
| Encontrar máximo | **O(log n)** | O(n) | O(h) | Sigue el camino derecho hasta la hoja |
| Altura del árbol | **O(1)** | O(1) | O(1) | Se mantiene en cada nodo |

---

## Fase 2 — Árbol AVL (Módulo: Catálogo de Cursos)

El AVL extiende el BST garantizando que el factor de balance de cada nodo sea `-1, 0 o +1`. Esto asegura altura `h = O(log n)` en **todos los casos**, eliminando la degeneración del BST.

### Operaciones AVL

| Operación | Complejidad | Espacio | Justificación |
|-----------|------------|---------|---------------|
| Insertar (`insertarAVL`) | **O(log n)** | O(log n) | Inserción BST + máx. 2 rotaciones al subir |
| Eliminar (con rebalanceo) | **O(log n)** | O(log n) | Eliminación BST + rotaciones en el camino de retorno |
| Buscar | **O(log n)** | O(log n) | Igual que BST pero garantizado |
| Rotación Simple (izq/der) | **O(1)** | O(1) | Reasignación de 3 punteros |
| Rotación Doble (izq-der / der-izq) | **O(1)** | O(1) | Dos rotaciones simples consecutivas |
| Obtener factor de balance | **O(1)** | O(1) | `altura(izq) - altura(der)` con altura almacenada |
| Formato gráfico (`obtenerFormatoGrafico`) | **O(n)** | O(n) | Recorre todo el árbol para serializar |

### Comparativa BST vs AVL

| Métrica | BST Peor Caso | AVL Garantizado |
|---------|--------------|-----------------|
| Altura | O(n) | **O(log n)** |
| Búsqueda | O(n) | **O(log n)** |
| Inserción | O(n) | **O(log n)** |
| Espacio extra | O(1) | O(1) por nodo (altura) |

---

## Fase 3 — Tabla Hash con Encadenamiento y Probing (Módulo: Catedráticos)

La tabla hash mapea el código de empleado (clave string) a un índice mediante tres funciones hash. El rendimiento ideal es O(1) amortizado, degradándose con colisiones.

### Funciones Hash Implementadas

| Función | Fórmula | Complejidad |
|---------|---------|-------------|
| **División** | `h(k) = keyToInt(k) mod N` | O(\|k\|) — longitud de la clave |
| **Multiplicación** | `h(k) = ⌊N · {k · φ}⌋` donde φ = 0.618... | O(\|k\|) |
| **DJB2** | `h = 5381; h = ((h << 5) + h) + charCode` | O(\|k\|) |

### Operaciones con Encadenamiento (Chaining)

| Operación | Caso Promedio | Peor Caso | Justificación |
|-----------|--------------|-----------|---------------|
| Insertar | **O(1)** | O(n) | Agregar al inicio de la cadena del bucket |
| Buscar | **O(1 + k)** ≈ O(1) | O(n) | `k` = largo de cadena, promedio O(1) si carga baja |
| Eliminar | **O(1 + k)** ≈ O(1) | O(n) | Buscar + reenlazar nodo en la cadena |

### Operaciones con Probing Lineal / Cuadrático

| Operación | Caso Promedio | Peor Caso | Fórmula de sondeo |
|-----------|--------------|-----------|-------------------|
| Insertar | **O(1)** | O(n) | Lineal: `(h+i) mod N`; Cuadrático: `(h+i²) mod N` |
| Buscar | **O(1)** | O(n) | Sondeo hasta encontrar o celda vacía |
| Eliminar | **O(1)** | O(n) | Marca `tombstone`, no rompe cadenas de sondeo |

### Rehashing Automático

| Operación | Complejidad |
|-----------|-------------|
| Rehash (factor de carga > 0.75) | **O(n)** | Reconstruye la tabla con capacidad `2N+1` |

> **Factor de carga** λ = n/N. Se mantiene λ < 0.75 para garantizar O(1) amortizado. Cuando λ supera el umbral, se realiza rehashing automático que es O(n) pero ocurre con frecuencia O(log n) en el tiempo de vida de la estructura.

---

## Fase 4 — Grafo Dirigido con Lista de Adyacencia (Módulo: Pensum Académico)

El grafo modela relaciones de prerrequisitos. Se representa con lista de adyacencia (`adjList`), óptima para grafos dispersos donde `E << V²`.

### Representación
- **Lista de adyacencia:** Espacio **O(V + E)**
- **Matriz de adyacencia (alternativa):** Espacio O(V²) — descartada por ser ineficiente en grafos dispersos

### Operaciones sobre el Grafo

| Operación | Complejidad Temporal | Complejidad Espacial | Justificación |
|-----------|---------------------|----------------------|---------------|
| Agregar vértice (`agregarCurso`) | **O(1)** | O(1) | Agrega código al array y crea entrada en adjList |
| Eliminar vértice (`eliminarCurso`) | **O(V + E)** | O(1) | Eliminar y barrer todas las aristas incidentes |
| Agregar arista (`agregarPrerrequisito`) | **O(1)** amortizado | O(1) | Push al array de vecinos |
| Eliminar arista (`eliminarPrerrequisito`) | **O(E/V)** | O(1) | Filtrar la lista del vértice fuente |
| **BFS** (recorrido en amplitud) | **O(V + E)** | O(V) | Cola FIFO, cada nodo y arista visitados una vez |
| **DFS** (recorrido en profundidad) | **O(V + E)** | O(V) | Pila recursiva, cada nodo y arista visitados una vez |
| **Detección de Ciclos** (DFS 3 colores) | **O(V + E)** | O(V) | Un DFS completo sobre el grafo |
| **Ordenamiento Topológico** (Kahn) | **O(V + E)** | O(V) | Calcula in-degree + cola con nodos de entrada 0 |
| **Camino más corto** (BFS no ponderado) | **O(V + E)** | O(V) | BFS garantiza camino mínimo en grafos no ponderados |
| Prerrequisitos directos | **O(V)** | O(V) | Busca vértices que apuntan al nodo destino |
| Prerrequisitos indirectos (DFS invertido) | **O(V + E)** | O(V) | DFS sobre grafo transpuesto desde el nodo objetivo |
| Serializar grafo (`obtenerEstructura`) | **O(V + E)** | O(V + E) | Recorre lista de adyacencia completa |

### Por qué BFS para camino más corto
En grafos **no ponderados**, BFS garantiza encontrar el camino con menor número de aristas (prerrequisitos intermedios) en **O(V + E)**. Dijkstra no es necesario aquí porque todas las aristas tienen peso uniforme = 1.

---

## Resumen General

| Fase | Estructura | Operación Clave | Complejidad |
|------|-----------|----------------|-------------|
| 1 | Lista Simple | Buscar estudiante | **O(n)** |
| 1 | Lista Simple | Invertir | **O(n)** in-place |
| 1 | Lista DLL | Navegar nodo a nodo | **O(1)** |
| 1 | Lista DLL | Ordenar historial | **O(n²)** |
| 2 | BST | Insertar/Buscar/Eliminar | **O(log n)** prom. / O(n) peor |
| 2 | AVL | Insertar/Buscar/Eliminar | **O(log n)** garantizado |
| 2 | AVL | Rotación | **O(1)** |
| 3 | Tabla Hash | Insertar/Buscar/Eliminar | **O(1)** amortizado |
| 3 | Tabla Hash | Rehash | **O(n)** |
| 4 | Grafo | BFS / DFS | **O(V + E)** |
| 4 | Grafo | Orden Topológico | **O(V + E)** |
| 4 | Grafo | Detección de Ciclos | **O(V + E)** |
| 4 | Grafo | Camino más corto | **O(V + E)** |

---

## Complejidad Espacial del Sistema Completo

| Módulo | Estructura en Memoria | Espacio |
|--------|----------------------|---------|
| Estudiantes | Lista Simple | **O(n)** |
| Historial | Lista DLL por estudiante | **O(m)** donde m = inscripciones totales |
| Catálogo de Cursos | Árbol AVL/BST | **O(n)** |
| Catedráticos | Tabla Hash | **O(N)** donde N = capacidad actual |
| Pensum | Lista de Adyacencia | **O(V + E)** |

---

## Notas de Implementación y Decisiones de Diseño

1. **Persistencia:** Todas las estructuras viven en memoria durante la ejecución. Al reiniciar el servidor, se reconstruyen desde archivos JSON. Esto mantiene la complejidad teórica de cada estructura sin depender de un DBMS externo.

2. **Árbol AVL como modo predeterminado:** El catálogo de cursos usa AVL por defecto al cargar desde JSON, garantizando O(log n) desde el inicio. El modo BST está disponible para comparación educativa.

3. **Tabla Hash — elección de capacidad primo:** La capacidad inicial (11) y las nuevas capacidades tras rehash (`2N+1`) son números primos. Esto reduce colisiones en las funciones de división y multiplicación al distribuir mejor las claves.

4. **Grafo — lista vs. matriz:** Se eligió lista de adyacencia por la naturaleza dispersa del pensum académico (cada curso tiene en promedio 1-3 prerrequisitos, no `V` conexiones). La complejidad espacial O(V+E) es drásticamente mejor que O(V²) de la matriz para este caso.

5. **Bubble Sort en DLL:** Aunque O(n²), su implementación directamente sobre punteros de la lista doblemente enlazada demuestra el manejo correcto de la estructura. Para historial con pocos cursos (< 50), el impacto es negligible.

---

*Documento generado para el Proyecto Final de Estructura de Datos — UniTrack*
*Universidad Regional de Guatemala — Junio 2026*
