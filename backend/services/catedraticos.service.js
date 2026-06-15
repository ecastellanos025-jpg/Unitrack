// Clase para los nodos de encadenamiento (Chaining)
class HashNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.siguiente = null;
  }
}

class CatedraticosHashTable {
  constructor(capacity = 11) {
    this.capacity = capacity;
    this.size = 0;
    this.hashFunctionType = 'division'; // 'division', 'multiplication', 'djb2'
    this.collisionMethod = 'chaining';   // 'chaining', 'linear', 'quadratic'
    this.collisionCount = 0;

    // Inicializar el arreglo de buckets
    this.buckets = new Array(capacity).fill(null);
  }

  // Helper para convertir claves string en entero
  _keyToInt(key) {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash = (hash * 31) + key.charCodeAt(i);
      hash = hash | 0; // Convertir a entero de 32 bits
    }
    return Math.abs(hash);
  }

  // --- FUNCIONES HASH ---
  _hash(key, capacity = this.capacity) {
    const k = this._keyToInt(key);
    switch (this.hashFunctionType) {
      case 'multiplication': {
        const A = 0.6180339887; // Constante áurea
        return Math.floor(capacity * ((k * A) % 1));
      }
      case 'djb2': {
        let h = 5381;
        for (let i = 0; i < key.length; i++) {
          h = ((h << 5) + h) + key.charCodeAt(i);
        }
        return Math.abs(h) % capacity;
      }
      case 'division':
      default:
        return k % capacity;
    }
  }

  // Cambiar configuración de la tabla y reconstruir
  configurar(hashFunctionType, collisionMethod) {
    const todos = this.obtenerListaElementos();
    this.hashFunctionType = hashFunctionType;
    this.collisionMethod = collisionMethod;
    this.buckets = new Array(this.capacity).fill(null);
    this.size = 0;
    this.collisionCount = 0;

    // Reinsertar todos
    todos.forEach(item => {
      this.insertar(item.key, item.value, false); // false para no re-disparar rehash aquí
    });
  }

  // --- OPERACIONES ---

  insertar(key, value, triggerRehash = true) {
    // Verificar si se supera el factor de carga de 0.75 y redimensionar
    if (triggerRehash && (this.size / this.capacity) > 0.75) {
      this._rehash(this.capacity * 2 + 1);
    }

    const index = this._hash(key);

    if (this.collisionMethod === 'chaining') {
      this._insertarChaining(index, key, value);
    } else {
      this._insertarProbing(index, key, value);
    }
  }

  _insertarChaining(index, key, value) {
    const nuevoNodo = new HashNode(key, value);
    if (!this.buckets[index]) {
      this.buckets[index] = nuevoNodo;
      this.size++;
    } else {
      // Ocurre una colisión
      this.collisionCount++;
      let actual = this.buckets[index];
      
      // Buscar si la clave ya existe para actualizarla
      while (actual) {
        if (actual.key === key) {
          actual.value = value;
          return;
        }
        if (!actual.siguiente) break;
        actual = actual.siguiente;
      }
      
      // Si no existe, agregar al final de la lista enlazada del bucket
      actual.siguiente = nuevoNodo;
      this.size++;
    }
  }

  _insertarProbing(index, key, value) {
    let i = 0;
    let colisionOcurrida = false;
    while (i < this.capacity) {
      const probeIndex = this._getProbingIndex(index, i);
      const cell = this.buckets[probeIndex];

      if (cell === null || cell.tombstone) {
        // Encontrado espacio libre o tombstone
        this.buckets[probeIndex] = { key, value };
        this.size++;
        if (colisionOcurrida) {
          this.collisionCount++;
        }
        return;
      } else if (cell.key === key) {
        // Clave ya existe, actualizar valor
        this.buckets[probeIndex].value = value;
        return;
      }

      // Si la celda está ocupada por otra clave, es colisión
      colisionOcurrida = true;
      i++;
    }
    // Si la tabla está llena (no debería pasar por el rehashing)
    this._rehash(this.capacity * 2 + 1);
    this.insertar(key, value);
  }

  // Calcular índice según Linear o Quadratic Probing
  _getProbingIndex(baseHash, step) {
    if (this.collisionMethod === 'quadratic') {
      return (baseHash + step * step) % this.capacity;
    } else {
      // Linear Probing por defecto
      return (baseHash + step) % this.capacity;
    }
  }

  // --- BÚSQUEDA ---
  buscar(key) {
    const index = this._hash(key);

    if (this.collisionMethod === 'chaining') {
      let actual = this.buckets[index];
      while (actual) {
        if (actual.key === key) {
          return actual.value;
        }
        actual = actual.siguiente;
      }
      return null;
    } else {
      let i = 0;
      while (i < this.capacity) {
        const probeIndex = this._getProbingIndex(index, i);
        const cell = this.buckets[probeIndex];

        if (cell === null) {
          return null; // Encontró celda vacía, no existe
        }
        if (!cell.tombstone && cell.key === key) {
          return cell.value; // Encontrado
        }
        i++;
      }
      return null;
    }
  }

  // --- ELIMINACIÓN ---
  eliminar(key) {
    const index = this._hash(key);

    if (this.collisionMethod === 'chaining') {
      let actual = this.buckets[index];
      let anterior = null;

      while (actual) {
        if (actual.key === key) {
          if (anterior) {
            anterior.siguiente = actual.siguiente;
          } else {
            this.buckets[index] = actual.siguiente;
          }
          this.size--;
          return true;
        }
        anterior = actual;
        actual = actual.siguiente;
      }
      return false;
    } else {
      let i = 0;
      while (i < this.capacity) {
        const probeIndex = this._getProbingIndex(index, i);
        const cell = this.buckets[probeIndex];

        if (cell === null) {
          return false; // Celda vacía, no existe
        }
        if (!cell.tombstone && cell.key === key) {
          // Marcar como Tombstone
          this.buckets[probeIndex] = { tombstone: true };
          this.size--;
          return true;
        }
        i++;
      }
      return false;
    }
  }

  // --- REHASHING ---
  _rehash(newCapacity) {
    const todos = this.obtenerListaElementos();
    this.capacity = newCapacity;
    this.buckets = new Array(newCapacity).fill(null);
    this.size = 0;
    this.collisionCount = 0;

    todos.forEach(item => {
      this.insertar(item.key, item.value, false);
    });
    console.log(`[Rehash] Tabla redimensionada a capacidad: ${this.capacity}. Elementos: ${this.size}`);
  }

  // --- UTILITIES ---

  obtenerFactorCarga() {
    return this.size / this.capacity;
  }

  // Obtener arreglo plano de elementos { key, value }
  obtenerListaElementos() {
    const lista = [];
    if (this.collisionMethod === 'chaining') {
      for (let i = 0; i < this.capacity; i++) {
        let actual = this.buckets[i];
        while (actual) {
          lista.push({ key: actual.key, value: actual.value });
          actual = actual.siguiente;
        }
      }
    } else {
      for (let i = 0; i < this.capacity; i++) {
        const cell = this.buckets[i];
        if (cell && !cell.tombstone) {
          lista.push({ key: cell.key, value: cell.value });
        }
      }
    }
    return lista;
  }

  // Formato detallado para renderizar los Buckets en la interfaz gráfica
  obtenerEstadoBuckets() {
    const bucketsDetalle = [];
    for (let i = 0; i < this.capacity; i++) {
      const cell = this.buckets[i];
      if (this.collisionMethod === 'chaining') {
        if (!cell) {
          bucketsDetalle.push({ index: i, estado: 'vacio', lista: [] });
        } else {
          const listItems = [];
          let actual = cell;
          while (actual) {
            listItems.push({ key: actual.key, value: actual.value });
            actual = actual.siguiente;
          }
          bucketsDetalle.push({ index: i, estado: 'ocupado', lista: listItems });
        }
      } else {
        if (cell === null) {
          bucketsDetalle.push({ index: i, estado: 'vacio', key: null, value: null });
        } else if (cell.tombstone) {
          bucketsDetalle.push({ index: i, estado: 'tombstone', key: null, value: null });
        } else {
          bucketsDetalle.push({ index: i, estado: 'ocupado', key: cell.key, value: cell.value });
        }
      }
    }
    return bucketsDetalle;
  }
}

module.exports = CatedraticosHashTable;
