class NodoInscripcion {
  constructor(inscripcion) {
    this.inscripcion = inscripcion;
    this.siguiente = null;
    this.anterior = null;
  }
}

class InscripcionesDoubleLinkedList {
  constructor() {
    this.cabeza = null;
    this.cola = null;
    this._tamano = 0;
  }

  // Insertar al inicio
  insertarAlInicio(inscripcion) {
    const nuevo = new NodoInscripcion(inscripcion);
    if (!this.cabeza) {
      this.cabeza = nuevo;
      this.cola = nuevo;
    } else {
      nuevo.siguiente = this.cabeza;
      this.cabeza.anterior = nuevo;
      this.cabeza = nuevo;
    }
    this._tamano++;
  }

  // Insertar al final
  insertarAlFinal(inscripcion) {
    const nuevo = new NodoInscripcion(inscripcion);
    if (!this.cola) {
      this.cabeza = nuevo;
      this.cola = nuevo;
    } else {
      nuevo.anterior = this.cola;
      this.cola.siguiente = nuevo;
      this.cola = nuevo;
    }
    this._tamano++;
  }

  // Eliminar por código de curso
  eliminarPorCurso(codigoCurso) {
    let actual = this.cabeza;
    let eliminado = false;
    
    while (actual) {
      if (actual.inscripcion.curso === codigoCurso) {
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
        eliminado = true;
        break; // Detener tras eliminar el primero coincidente
      }
      actual = actual.siguiente;
    }
    return eliminado;
  }

  // Buscar por curso o por semestre
  buscarPorCursoOSemestre(query) {
    const resultados = [];
    let actual = this.cabeza;
    const queryStr = String(query).toLowerCase();
    
    while (actual) {
      const curso = String(actual.inscripcion.curso).toLowerCase();
      const semestre = String(actual.inscripcion.semestre).toLowerCase();
      
      if (curso === queryStr || semestre === queryStr) {
        resultados.push(actual.inscripcion);
      }
      actual = actual.siguiente;
    }
    return resultados;
  }

  // Ordenar por Semestre (Bubble Sort in-place)
  ordenarPorSemestre() {
    if (!this.cabeza || this._tamano < 2) return;
    let intercambiado;
    do {
      intercambiado = false;
      let actual = this.cabeza;
      while (actual.siguiente) {
        if (Number(actual.inscripcion.semestre) > Number(actual.siguiente.inscripcion.semestre)) {
          // Intercambiar datos
          const temp = actual.inscripcion;
          actual.inscripcion = actual.siguiente.inscripcion;
          actual.siguiente.inscripcion = temp;
          intercambiado = true;
        }
        actual = actual.siguiente;
      }
    } while (intercambiado);
  }

  // Ordenar por Nota (Bubble Sort in-place)
  ordenarPorNota() {
    if (!this.cabeza || this._tamano < 2) return;
    let intercambiado;
    do {
      intercambiado = false;
      let actual = this.cabeza;
      while (actual.siguiente) {
        if (Number(actual.inscripcion.nota) > Number(actual.siguiente.inscripcion.nota)) {
          // Intercambiar datos
          const temp = actual.inscripcion;
          actual.inscripcion = actual.siguiente.inscripcion;
          actual.siguiente.inscripcion = temp;
          intercambiado = true;
        }
        actual = actual.siguiente;
      }
    } while (intercambiado);
  }

  // Listar todos adelante (Orden cronológico)
  listarTodos() {
    const inscripciones = [];
    let actual = this.cabeza;
    while (actual) {
      inscripciones.push(actual.inscripcion);
      actual = actual.siguiente;
    }
    return inscripciones;
  }

  // Listar inverso (Orden inverso usando punteros anteriores)
  listarInverso() {
    const inscripciones = [];
    let actual = this.cola;
    while (actual) {
      inscripciones.push(actual.inscripcion);
      actual = actual.anterior;
    }
    return inscripciones;
  }

  tamano() {
    return this._tamano;
  }
}

module.exports = InscripcionesDoubleLinkedList;
