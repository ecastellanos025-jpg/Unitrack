class NodoCurso {
  constructor(curso) {
    this.curso = curso; // { codigo, nombre, creditos, catedratico, horario, cupoMaximo }
    this.codigo = curso.codigo;
    this.izquierdo = null;
    this.derecho = null;
    this.altura = 1; // Altura inicial
  }
}

class CursosTree {
  constructor() {
    this.raiz = null;
  }

  // --- MÉTODOS AUXILIARES ---
  
  _obtenerAltura(nodo) {
    if (!nodo) return 0;
    return nodo.altura;
  }

  _obtenerBalance(nodo) {
    if (!nodo) return 0;
    return this._obtenerAltura(nodo.izquierdo) - this._obtenerAltura(nodo.derecho);
  }

  _actualizarAltura(nodo) {
    if (!nodo) return;
    nodo.altura = 1 + Math.max(this._obtenerAltura(nodo.izquierdo), this._obtenerAltura(nodo.derecho));
  }

  // Rotación a la derecha
  _rotarDerecha(y) {
    const x = y.izquierdo;
    const T2 = x.derecho;

    // Realizar rotación
    x.derecho = y;
    y.izquierdo = T2;

    // Actualizar alturas
    this._actualizarAltura(y);
    this._actualizarAltura(x);

    return x; // Nueva raíz
  }

  // Rotación a la izquierda
  _rotarIzquierda(x) {
    const y = x.derecho;
    const T2 = y.izquierdo;

    // Realizar rotación
    y.izquierdo = x;
    x.derecho = T2;

    // Actualizar alturas
    this._actualizarAltura(x);
    this._actualizarAltura(y);

    return y; // Nueva raíz
  }

  // --- INSERCIÓN BST (Sin balanceo) ---
  insertarBST(curso) {
    this.raiz = this._insertarBSTRec(this.raiz, curso);
  }

  _insertarBSTRec(nodo, curso) {
    if (!nodo) return new NodoCurso(curso);

    if (curso.codigo < nodo.codigo) {
      nodo.izquierdo = this._insertarBSTRec(nodo.izquierdo, curso);
    } else if (curso.codigo > nodo.codigo) {
      nodo.derecho = this._insertarBSTRec(nodo.derecho, curso);
    } else {
      // Duplicado, actualizar datos
      nodo.curso = curso;
    }

    this._actualizarAltura(nodo);
    return nodo;
  }

  // --- INSERCIÓN AVL (Con balanceo automático) ---
  insertarAVL(curso) {
    this.raiz = this._insertarAVLRec(this.raiz, curso);
  }

  _insertarAVLRec(nodo, curso) {
    // 1. Inserción normal de BST
    if (!nodo) return new NodoCurso(curso);

    if (curso.codigo < nodo.codigo) {
      nodo.izquierdo = this._insertarAVLRec(nodo.izquierdo, curso);
    } else if (curso.codigo > nodo.codigo) {
      nodo.derecho = this._insertarAVLRec(nodo.derecho, curso);
    } else {
      nodo.curso = curso; // Duplicado, actualizar
      return nodo;
    }

    // 2. Actualizar altura
    this._actualizarAltura(nodo);

    // 3. Obtener factor de balance
    const balance = this._obtenerBalance(nodo);

    // Caso Izquierda Izquierda
    if (balance > 1 && curso.codigo < nodo.izquierdo.codigo) {
      return this._rotarDerecha(nodo);
    }

    // Caso Derecha Derecha
    if (balance < -1 && curso.codigo > nodo.derecho.codigo) {
      return this._rotarIzquierda(nodo);
    }

    // Caso Izquierda Derecha (Rotación doble)
    if (balance > 1 && curso.codigo > nodo.izquierdo.codigo) {
      nodo.izquierdo = this._rotarIzquierda(nodo.izquierdo);
      return this._rotarDerecha(nodo);
    }

    // Caso Derecha Izquierda (Rotación doble)
    if (balance < -1 && curso.codigo < nodo.derecho.codigo) {
      nodo.derecho = this._rotarDerecha(nodo.derecho);
      return this._rotarIzquierda(nodo);
    }

    return nodo;
  }

  // --- BÚSQUEDA ---
  buscar(codigo) {
    return this._buscarRec(this.raiz, codigo);
  }

  _buscarRec(nodo, codigo) {
    if (!nodo || nodo.codigo === codigo) return nodo;

    if (codigo < nodo.codigo) {
      return this._buscarRec(nodo.izquierdo, codigo);
    }
    return this._buscarRec(nodo.derecho, codigo);
  }

  // --- ELIMINACIÓN ---
  eliminar(codigo) {
    let eliminado = false;
    this.raiz = this._eliminarRec(this.raiz, codigo, () => {
      eliminado = true;
    });
    return eliminado;
  }

  _eliminarRec(nodo, codigo, onExito) {
    if (!nodo) return null;

    if (codigo < nodo.codigo) {
      nodo.izquierdo = this._eliminarRec(nodo.izquierdo, codigo, onExito);
    } else if (codigo > nodo.codigo) {
      nodo.derecho = this._eliminarRec(nodo.derecho, codigo, onExito);
    } else {
      // Encontrado! Ejecutar callback de éxito
      onExito();

      // Caso 1: Sin hijos o un solo hijo
      if (!nodo.izquierdo) return nodo.derecho;
      if (!nodo.derecho) return nodo.izquierdo;

      // Caso 2: Dos hijos. Obtener el sucesor en inorden (mínimo del subárbol derecho)
      const sucesor = this._obtenerMinimoNodo(nodo.derecho);
      nodo.codigo = sucesor.codigo;
      nodo.curso = sucesor.curso;
      
      // Eliminar el sucesor
      nodo.derecho = this._eliminarRec(nodo.derecho, sucesor.codigo, () => {});
    }

    // Si el árbol tenía un solo nodo
    if (!nodo) return null;

    this._actualizarAltura(nodo);
    
    // Opcional: Re-balancear después de eliminar para mantener propiedad AVL
    const balance = this._obtenerBalance(nodo);

    if (balance > 1 && this._obtenerBalance(nodo.izquierdo) >= 0) {
      return this._rotarDerecha(nodo);
    }

    if (balance > 1 && this._obtenerBalance(nodo.izquierdo) < 0) {
      nodo.izquierdo = this._rotarIzquierda(nodo.izquierdo);
      return this._rotarDerecha(nodo);
    }

    if (balance < -1 && this._obtenerBalance(nodo.derecho) <= 0) {
      return this._rotarIzquierda(nodo);
    }

    if (balance < -1 && this._obtenerBalance(nodo.derecho) > 0) {
      nodo.derecho = this._rotarDerecha(nodo.derecho);
      return this._rotarIzquierda(nodo);
    }

    return nodo;
  }

  _obtenerMinimoNodo(nodo) {
    let actual = nodo;
    while (actual.izquierdo) {
      actual = actual.izquierdo;
    }
    return actual;
  }

  encontrarMinimo() {
    if (!this.raiz) return null;
    return this._obtenerMinimoNodo(this.raiz).curso;
  }

  encontrarMaximo() {
    if (!this.raiz) return null;
    let actual = this.raiz;
    while (actual.derecho) {
      actual = actual.derecho;
    }
    return actual.curso;
  }

  // --- RECORRIDOS ---
  inOrden() {
    const resultado = [];
    this._inOrdenRec(this.raiz, resultado);
    return resultado;
  }

  _inOrdenRec(nodo, resultado) {
    if (nodo) {
      this._inOrdenRec(nodo.izquierdo, resultado);
      resultado.push(nodo.curso);
      this._inOrdenRec(nodo.derecho, resultado);
    }
  }

  preOrden() {
    const resultado = [];
    this._preOrdenRec(this.raiz, resultado);
    return resultado;
  }

  _preOrdenRec(nodo, resultado) {
    if (nodo) {
      resultado.push(nodo.curso);
      this._preOrdenRec(nodo.izquierdo, resultado);
      this._preOrdenRec(nodo.derecho, resultado);
    }
  }

  postOrden() {
    const resultado = [];
    this._postOrdenRec(this.raiz, resultado);
    return resultado;
  }

  _postOrdenRec(nodo, resultado) {
    if (nodo) {
      this._postOrdenRec(nodo.izquierdo, resultado);
      this._postOrdenRec(nodo.derecho, resultado);
      resultado.push(nodo.curso);
    }
  }

  // Obtener estructura completa con alturas y balances para graficar en frontend
  obtenerFormatoGrafico() {
    return this._obtenerFormatoGraficoRec(this.raiz);
  }

  _obtenerFormatoGraficoRec(nodo) {
    if (!nodo) return null;
    return {
      codigo: nodo.codigo,
      nombre: nodo.curso.nombre,
      altura: nodo.altura,
      balance: this._obtenerBalance(nodo),
      izquierdo: this._obtenerFormatoGraficoRec(nodo.izquierdo),
      derecho: this._obtenerFormatoGraficoRec(nodo.derecho)
    };
  }

  obtenerAlturaTotal() {
    return this._obtenerAltura(this.raiz);
  }
}

module.exports = CursosTree;
