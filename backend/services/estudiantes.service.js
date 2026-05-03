class NodoEstudiante {
  constructor(estudiante) {
    this.estudiante = estudiante;
    this.siguiente = null;
    this.anterior = null; // Puntero doble
  }
}

class EstudiantesLinkedList {
  constructor() {
    this.cabeza = null;
    this.cola = null; // Opcional, pero útil
    this._tamano = 0;
  }

  // Insertar al final (Requisito 2.1)
  insertarAlFinal(estudiante) {
    const nuevo = new NodoEstudiante(estudiante);
    if (!this.cabeza) {
      this.cabeza = nuevo;
      this.cola = nuevo;
    } else {
      nuevo.anterior = this.cola;
      this.cola.siguiente = nuevo;
      this.cola = nuevo;
    }
    this._tamano++;
  }

  // Listar todos para el API (Requisito 2.1)
  listarTodos() {
    const estudiantes = [];
    let actual = this.cabeza;
    while (actual) {
      estudiantes.push(actual.estudiante);
      actual = actual.siguiente;
    }
    return estudiantes;
  }

  // Invertir in-place (Operación obligatoria)
  invertir() {
    let actual = this.cabeza;
    let temp = null;
    
    // Intercambiar punteros siguiente y anterior de todos los nodos
    while (actual) {
      temp = actual.anterior;
      actual.anterior = actual.siguiente;
      actual.siguiente = temp;
      actual = actual.anterior; // Avanzamos al "siguiente" original (que ahora es el anterior)
    }
    
    // Al final, intercambiamos cabeza y cola
    if (temp) {
      this.cola = this.cabeza;
      this.cabeza = temp.anterior;
    }
  }

  // Buscar nodo por carnet
  buscarPorCarnet(carnet) {
    let actual = this.cabeza;
    while (actual) {
      if (actual.estudiante.carnet == carnet) {
        return actual;
      }
      actual = actual.siguiente;
    }
    return null;
  }

  // Eliminar nodo específico
  eliminarPorCarnet(carnet) {
    let actual = this.buscarPorCarnet(carnet);
    if (!actual) return false;

    if (actual.anterior) {
      actual.anterior.siguiente = actual.siguiente;
    } else {
      this.cabeza = actual.siguiente;
    }

    if (actual.siguiente) {
      actual.siguiente.anterior = actual.anterior;
    } else {
      this.cola = actual.anterior;
    }

    this._tamano--;
    return true;
  }

  // Obtener tamaño
  tamano() {
    return this._tamano;
  }
}

module.exports = EstudiantesLinkedList;
