import { TaskService } from '../services/taskService.js';
export class TaskController {
    /**
     * GET /tasks - Listar todas las tareas
     */
    static async getTasks(_req, res) {
        try {
            const tasks = await TaskService.getAllTasks();
            res.status(200).json({
                success: true,
                data: tasks,
            });
        }
        catch (error) {
            console.error('Error al obtener tareas:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor al consultar las tareas.',
            });
        }
    }
    /**
     * POST /task - Crear una nueva tarea
     */
    static async createTask(req, res) {
        try {
            const { description } = req.body;
            if (!description || typeof description !== 'string' || description.trim().length === 0) {
                res.status(400).json({
                    success: false,
                    message: 'La descripción de la tarea es obligatoria y debe ser un texto.',
                });
                return;
            }
            const newTask = await TaskService.createTask(description);
            res.status(201).json({
                success: true,
                message: 'Tarea creada exitosamente.',
                data: newTask,
            });
        }
        catch (error) {
            console.error('Error al crear tarea:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor al crear la tarea.',
            });
        }
    }
    /**
     * PATCH /task/:id - Actualizar o marcar como realizada una tarea
     */
    static async updateTask(req, res) {
        try {
            const { id } = req.params;
            const { completed, description } = req.body;
            if (!id) {
                res.status(400).json({
                    success: false,
                    message: 'El ID de la tarea es requerido.',
                });
                return;
            }
            const updates = {};
            if (typeof completed === 'boolean') {
                updates.completed = completed;
            }
            if (typeof description === 'string' && description.trim().length > 0) {
                updates.description = description.trim();
            }
            const updatedTask = await TaskService.updateTask(id, updates);
            if (!updatedTask) {
                res.status(404).json({
                    success: false,
                    message: `No se encontró ninguna tarea con el ID: ${id}`,
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: 'Tarea actualizada exitosamente.',
                data: updatedTask,
            });
        }
        catch (error) {
            console.error('Error al actualizar tarea:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor al actualizar la tarea.',
            });
        }
    }
    /**
     * DELETE /task/:id - Descartar/Eliminar una tarea
     */
    static async deleteTask(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                res.status(400).json({
                    success: false,
                    message: 'El ID de la tarea es requerido.',
                });
                return;
            }
            const deleted = await TaskService.deleteTask(id);
            if (!deleted) {
                res.status(404).json({
                    success: false,
                    message: `No se encontró ninguna tarea con el ID: ${id}`,
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: 'Tarea eliminada exitosamente.',
                data: { id },
            });
        }
        catch (error) {
            console.error('Error al eliminar tarea:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor al eliminar la tarea.',
            });
        }
    }
}
