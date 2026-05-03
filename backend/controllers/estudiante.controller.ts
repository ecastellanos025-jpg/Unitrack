import { Request, Response } from 'express';
import { EstudiantesLinkedList } from '../services/estudiantes.service';

// Instancia global de la lista (Persistencia en memoria tras carga inicial)
const listaEstudiantes = new EstudiantesLinkedList();

export const getEstudiantes = (req: Request, res: Response) => {
    const todos = listaEstudiantes.listarTodos();
    res.status(200).json(todos); // HTTP 200: OK 
};

export const invertirLista = (req: Request, res: Response) => {
    if (listaEstudiantes.tamano() === 0) {
        return res.status(400).json({ message: "La lista está vacía" }); // HTTP 400: Bad Request 
    }
    listaEstudiantes.invertir();
    res.status(200).json({
        message: "Lista invertida exitosamente in-place",
        data: listaEstudiantes.listarTodos()
    });
};

export const buscarEstudiante = (req: Request, res: Response) => {
    const { carnet } = req.params;
    const estudiante = listaEstudiantes.buscarPorCarnet(carnet); // Debes implementar este método en el service

    if (!estudiante) {
        return res.status(404).json({ message: "Estudiante no encontrado" }); // HTTP 404: Not Found 
    }
    res.status(200).json(estudiante);
};