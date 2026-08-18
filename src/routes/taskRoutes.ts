import { Router } from 'express';
import { TaskController } from '../controllers/taskController.js';

const router = Router();

// Endpoint para obtener todas las tareas
router.get('/tasks', TaskController.getTasks);

// Endpoint para crear una tarea (POST /task)
router.post('/task', TaskController.createTask);

// Endpoint para marcar como realizada o editar tarea (PATCH /task/:id)
router.patch('/task/:id', TaskController.updateTask);

// Endpoint para descartar/eliminar tarea (DELETE /task/:id)
router.delete('/task/:id', TaskController.deleteTask);

export default router;
