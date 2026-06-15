class PensumGraph {
  constructor() {
    this.adjList = {}; // list of neighbors: curso -> [cursos desbloqueados por este]
    this.vertices = []; // lista de cursos en el grafo
  }

  // --- VÉRTICES ---
  agregarCurso(codigo) {
    if (!this.vertices.includes(codigo)) {
      this.vertices.push(codigo);
      this.adjList[codigo] = [];
    }
  }

  eliminarCurso(codigo) {
    this.vertices = this.vertices.filter(v => v !== codigo);
    delete this.adjList[codigo];

    // Eliminar relaciones entrantes hacia este curso
    for (const v in this.adjList) {
      this.adjList[v] = this.adjList[v].filter(target => target !== codigo);
    }
  }

  // --- ARISTAS (Prerrequisito: A -> B significa que A desbloquea a B, o A es prerrequisito de B) ---
  agregarPrerrequisito(codigoA, codigoB) {
    this.agregarCurso(codigoA);
    this.agregarCurso(codigoB);
    if (!this.adjList[codigoA].includes(codigoB)) {
      this.adjList[codigoA].push(codigoB);
    }
  }

  eliminarPrerrequisito(codigoA, codigoB) {
    if (this.adjList[codigoA]) {
      this.adjList[codigoA] = this.adjList[codigoA].filter(v => v !== codigoB);
    }
  }

  // --- RECORRIDO EN AMPLITUD (BFS) ---
  BFS(inicio) {
    if (!this.vertices.includes(inicio)) return [];
    
    const visitados = {};
    const cola = [inicio];
    const orden = [];
    visitados[inicio] = true;

    while (cola.length > 0) {
      const actual = cola.shift();
      orden.push(actual);

      const vecinos = this.adjList[actual] || [];
      for (const vecino of vecinos) {
        if (!visitados[vecino]) {
          visitados[vecino] = true;
          cola.push(vecino);
        }
      }
    }
    return orden;
  }

  // --- RECORRIDO EN PROFUNDIDAD (DFS) ---
  DFS(inicio) {
    if (!this.vertices.includes(inicio)) return [];

    const visitados = {};
    const orden = [];
    
    this._DFSRec(inicio, visitados, orden);
    return orden;
  }

  _DFSRec(vertice, visitados, orden) {
    visitados[vertice] = true;
    orden.push(vertice);

    const vecinos = this.adjList[vertice] || [];
    for (const vecino of vecinos) {
      if (!visitados[vecino]) {
        this._DFSRec(vecino, visitados, orden);
      }
    }
  }

  // --- DETECCIÓN DE CICLOS (DFS con 3 colores) ---
  // Colores: 0 = Blanco (no visitado), 1 = Gris (en proceso de visita), 2 = Negro (completamente visitado)
  detectarCiclos() {
    const colores = {};
    for (const v of this.vertices) {
      colores[v] = 0;
    }

    const cicloDetectado = { flag: false };

    for (const v of this.vertices) {
      if (colores[v] === 0) {
        this._detectarCiclosDFS(v, colores, cicloDetectado);
        if (cicloDetectado.flag) return true;
      }
    }
    return false;
  }

  _detectarCiclosDFS(v, colores, cicloDetectado) {
    colores[v] = 1; // Gris: Empezando visita de este nodo y sus hijos

    const vecinos = this.adjList[v] || [];
    for (const vecino of vecinos) {
      if (colores[vecino] === 1) {
        // Encontró un nodo gris: ¡Se detecta ciclo de retroalimentación!
        cicloDetectado.flag = true;
        return;
      }
      if (colores[vecino] === 0) {
        this._detectarCiclosDFS(vecino, colores, cicloDetectado);
        if (cicloDetectado.flag) return;
      }
    }

    colores[v] = 2; // Negro: Completado
  }

  // --- ORDENAMIENTO TOPOLÓGICO (Algoritmo de Kahn) ---
  ordenamientoTopologico() {
    // Calcular grados de entrada (in-degree)
    const inDegree = {};
    for (const v of this.vertices) {
      inDegree[v] = 0;
    }

    for (const v of this.vertices) {
      const vecinos = this.adjList[v] || [];
      for (const vecino of vecinos) {
        inDegree[vecino] = (inDegree[vecino] || 0) + 1;
      }
    }

    // Inicializar cola con nodos sin dependencias (in-degree = 0)
    const cola = [];
    for (const v of this.vertices) {
      if (inDegree[v] === 0) {
        cola.push(v);
      }
    }

    const resultado = [];

    while (cola.length > 0) {
      const actual = cola.shift();
      resultado.push(actual);

      const vecinos = this.adjList[actual] || [];
      for (const vecino of vecinos) {
        inDegree[vecino]--;
        if (inDegree[vecino] === 0) {
          cola.push(vecino);
        }
      }
    }

    // Si el orden contiene todos los vértices, no hay ciclos y es válido
    if (resultado.length === this.vertices.length) {
      return resultado;
    }
    return []; // Retorna vacío si hay ciclos (no se puede ordenar)
  }

  // --- CAMINO MÁS CORTO (BFS en Grafo no ponderado) ---
  caminoMasCorto(inicio, fin) {
    if (!this.vertices.includes(inicio) || !this.vertices.includes(fin)) return null;
    if (inicio === fin) return [inicio];

    const visitados = {};
    const predecesores = {};
    const cola = [inicio];
    visitados[inicio] = true;

    let encontrado = false;

    while (cola.length > 0) {
      const actual = cola.shift();
      if (actual === fin) {
        encontrado = true;
        break;
      }

      const vecinos = this.adjList[actual] || [];
      for (const vecino of vecinos) {
        if (!visitados[vecino]) {
          visitados[vecino] = true;
          predecesores[vecino] = actual;
          cola.push(vecino);
        }
      }
    }

    if (!encontrado) return null; // No hay ruta entre inicio y fin

    // Reconstruir camino hacia atrás
    const camino = [];
    let paso = fin;
    while (paso) {
      camino.unshift(paso);
      paso = predecesores[paso];
    }
    return camino;
  }

  // --- PRERREQUISITOS DIRECTOS E INDIRECTOS ---
  // Queremos ver todos los cursos que X requiere para poder ser cursado.
  // Es decir, qué cursos pueden alcanzar a X.
  // Construimos el grafo invertido y corremos un DFS desde X.
  obtenerPrerrequisitos(codigo) {
    if (!this.vertices.includes(codigo)) return { directos: [], indirectos: [] };

    // 1. Encontrar directos: Cursos 'V' que tienen a 'codigo' en su lista de adyacencia
    const directos = [];
    for (const v of this.vertices) {
      if (this.adjList[v] && this.adjList[v].includes(codigo)) {
        directos.push(v);
      }
    }

    // 2. Encontrar indirectos: Todos los ancestros menos los directos
    // Hacemos un grafo de pre-requisitos (invertido)
    const revGraph = {};
    for (const v of this.vertices) {
      revGraph[v] = [];
    }

    for (const v of this.vertices) {
      const vecinos = this.adjList[v] || [];
      for (const vecino of vecinos) {
        // En el grafo original: v -> vecino (v es prerrequisito de vecino)
        // En el grafo invertido: vecino -> v (para saber qué requiere vecino)
        revGraph[vecino].push(v);
      }
    }

    // DFS para buscar todos los alcanzables desde 'codigo' en el grafo invertido
    const todosPrerrequisitos = [];
    const visitados = {};
    
    const dfsInvertido = (curr) => {
      visitados[curr] = true;
      const padres = revGraph[curr] || [];
      for (const p of padres) {
        if (!visitados[p]) {
          todosPrerrequisitos.push(p);
          dfsInvertido(p);
        }
      }
    };

    dfsInvertido(codigo);

    // Los indirectos serán todos los prerrequisitos excepto los directos
    const indirectos = todosPrerrequisitos.filter(p => !directos.includes(p));

    return {
      directos,
      indirectos
    };
  }

  // Obtener estado del grafo para renderizar
  obtenerEstructura() {
    const nodes = this.vertices;
    const edges = [];

    for (const v of this.vertices) {
      const vecinos = this.adjList[v] || [];
      for (const vecino of vecinos) {
        edges.push({ source: v, target: vecino });
      }
    }

    return {
      nodes,
      edges
    };
  }
}

module.exports = PensumGraph;
