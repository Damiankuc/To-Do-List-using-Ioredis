import { v4 as uuidv4 } from 'uuid';
import { redis } from '../config/redis.js';
const REDIS_TASKS_KEY = 'tasks';
export class TaskService {
    /**
     * Obtiene todas las tareas almacenadas en Redis.
     */
    static async getAllTasks() {
        const rawTasks = await redis.hgetall(REDIS_TASKS_KEY);
        const tasks = [];
        for (const id in rawTasks) {
            try {
                const task = JSON.parse(rawTasks[id]);
                tasks.push(task);
            }
            catch (err) {
                console.error(`Error al parsear la tarea con ID ${id}:`, err);
            }
        }
        // Ordenar por fecha de creación (más recientes primero)
        return tasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    /**
     * Obtiene una tarea específica por su ID.
     */
    static async getTaskById(id) {
        const rawTask = await redis.hget(REDIS_TASKS_KEY, id);
        if (!rawTask)
            return null;
        return JSON.parse(rawTask);
    }
    /**
     * Crea una nueva tarea y la guarda en Redis con HSET.
     */
    static async createTask(description) {
        const newTask = {
            id: uuidv4(),
            description: description.trim(),
            completed: false,
            createdAt: new Date().toISOString(),
        };
        await redis.hset(REDIS_TASKS_KEY, newTask.id, JSON.stringify(newTask));
        return newTask;
    }
    /**
     * Actualiza el estado de una tarea (por ejemplo marcar como realizada).
     */
    static async updateTask(id, updates) {
        const existingTask = await this.getTaskById(id);
        if (!existingTask)
            return null;
        const updatedTask = {
            ...existingTask,
            ...updates,
            id: existingTask.id, // Preservar ID original
            createdAt: existingTask.createdAt, // Preservar fecha original
        };
        await redis.hset(REDIS_TASKS_KEY, id, JSON.stringify(updatedTask));
        return updatedTask;
    }
    /**
     * Elimina una tarea de Redis usando HDEL.
     */
    static async deleteTask(id) {
        const result = await redis.hdel(REDIS_TASKS_KEY, id);
        return result > 0;
    }
}
