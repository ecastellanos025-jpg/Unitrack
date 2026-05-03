class NodoInscripcion {
    inscripcion: any;
    siguiente: NodoInscripcion | null = null;
    anterior: NodoInscripcion | null = null;

    constructor(inscripcion: any) {
        this.inscripcion = inscripcion;
    }
}

export class HistorialInscripcionesDLL {
    private cabeza: NodoInscripcion | null = null;
    private cola: NodoInscripcion | null = null;

    // Insertar al final (Requisito 2.1) [cite: 40]
    insertarAlFinal(inscripcion: any) {
        const nuevo = new NodoInscripcion(inscripcion);
        if (!this.cabeza) {
            this.cabeza = this.cola = nuevo;
        } else {
            nuevo.anterior = this.cola;
            this.cola!.siguiente = nuevo;
            this.cola = nuevo;
        }
    }

    // Ordenamiento por Semestre (Bubble Sort sobre lista) 
    ordenarPorSemestre() {
        if (!this.cabeza) return;
        let interrumpido: boolean;
        do {
            interrumpido = false;
            let actual = this.cabeza;
            while (actual.siguiente) {
                if (actual.inscripcion.semestre > actual.siguiente.inscripcion.semestre) {
                    // Intercambio de datos [cite: 45]
                    const temp = actual.inscripcion;
                    actual.inscripcion = actual.siguiente.inscripcion;
                    actual.siguiente.inscripcion = temp;
                    interrumpido = true;
                }
                actual = actual.siguiente;
            }
        } while (interrumpido);
    }

    // Recorrer adelante para el API 
    listarHistorial() {
        const historial = [];
        let actual = this.cabeza;
        while (actual) {
            historial.push(actual.inscripcion);
            actual = actual.siguiente;
        }
        return historial;
    }
}