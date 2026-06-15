class NodoEstudiante {
  constructor(estudiante) {
    this.estudiante = estudiante;
    this.siguiente = null;
  }
}

class EstudiantesSimpleLinkedList {
  constructor() {
    this.cabeza = null;
    this._tamano = 0;
  }

  // Insertar al inicio
  insertarAlInicio(estudiante) {
    const nuevo = new NodoEstudiante(estudiante);
    nuevo.siguiente = this.cabeza;
    this.cabeza = nuevo;
    this._tamano++;
  }

  // Insertar al final
  insertarAlFinal(estudiante) {
    const nuevo = new NodoEstudiante(estudiante);
    if (!this.cabeza) {
      this.cabeza = nuevo;
    } else {
      let actual = this.cabeza;
      while (actual.siguiente) {
        actual = actual.siguiente;
      }
      actual.siguiente = nuevo;
    }
    this._tamano++;
  }

  // Insertar en posición específica (0-indexed)
  insertarEnPosicion(indice, estudiante) {
    if (indice < 0 || indice > this._tamano) return false;
    
    if (indice === 0) {
      this.insertarAlInicio(estudiante);
      return true;
    }

    const nuevo = new NodoEstudiante(estudiante);
    let actual = this.cabeza;
    let anterior = null;
    let i = 0;
    
    while (i < indice) {
      anterior = actual;
      actual = actual.siguiente;
      i++;
    }
    
    nuevo.siguiente = actual;
    anterior.siguiente = nuevo;
    this._tamano++;
    return true;
  }

  // Listar todos para el API
  listarTodos() {
    const estudiantes = [];
    let actual = this.cabeza;
    while (actual) {
      estudiantes.push(actual.estudiante);
      actual = actual.siguiente;
    }
    return estudiantes;
  }

  // Invertir in-place (Modificación de punteros)
  invertir() {
    let anterior = null;
    let actual = this.cabeza;
    let siguienteNode = null;

    while (actual) {
      siguienteNode = actual.siguiente; // Guardar el siguiente
      actual.siguiente = anterior;      // Invertir el puntero
      anterior = actual;                // Avanzar anterior
      actual = siguienteNode;           // Avanzar actual
    }
    this.cabeza = anterior;             // La nueva cabeza es el último procesado
  }

  // Buscar por carnet (búsqueda lineal)
  buscarPorCarnet(carnet) {
    let actual = this.cabeza;
    while (actual) {
      if (actual.estudiante.carnet === carnet) {
        return actual;
      }
      actual = actual.siguiente;
    }
    return null;
  }

  // Eliminar nodo por carnet
  eliminarPorCarnet(carnet) {
    if (!this.cabeza) return false;

    if (this.cabeza.estudiante.carnet === carnet) {
      this.cabeza = this.cabeza.siguiente;
      this._tamano--;
      return true;
    }

    let actual = this.cabeza;
    let anterior = null;

    while (actual && actual.estudiante.carnet !== carnet) {
      anterior = actual;
      actual = actual.siguiente;
    }

    if (!actual) return false; // No encontrado

    anterior.siguiente = actual.siguiente;
    this._tamano--;
    return true;
  }

  // Obtener tamaño
  tamano() {
    return this._tamano;
  }
}

module.exports = EstudiantesSimpleLinkedList;
