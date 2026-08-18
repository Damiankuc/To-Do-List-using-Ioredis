# To-Do List usando Redis y ioredis (Node.js + Express + TypeScript)

Una aplicación web de lista de tareas (To-Do) moderna, modular y completa construida con **TypeScript**, **Express**, **ioredis** para persistencia en base de datos Redis en memoria, y un frontend dinámico en **HTML/CSS/JavaScript**.

---

## 🚀 Arquitectura y Tecnologías

- **Frontend**: HTML5, CSS3 (diseño moderno con tema oscuro, glassmorphism y microanimaciones), Vanilla JavaScript (consumo de la API REST mediante `fetch`).
- **Backend**: Node.js, Express, TypeScript.
- **Base de Datos**: Redis en memoria utilizando la librería oficial `ioredis`.

---

## 🛠️ Estructura del Proyecto

```
To-Do-List-using-Ioredis/
├── docker-compose.yml       # Configuración para ejecutar Redis con Docker
├── package.json             # Dependencias y scripts de ejecución
├── tsconfig.json            # Configuración del compilador TypeScript
├── .env.example             # Variables de entorno de ejemplo
├── .env                     # Variables de entorno locales
├── README.md                # Documentación completa del proyecto
├── public/                  # Frontend estático
│   ├── index.html           # Interfaz web principal
│   ├── style.css            # Estilos CSS con glassmorphism
│   └── app.js               # Cliente JavaScript que consume la API REST
└── src/                     # Backend en TypeScript
    ├── server.ts            # Punto de entrada y arranque del servidor HTTP
    ├── app.ts               # Configuración de Express, middlewares y rutas
    ├── config/
    │   └── redis.ts         # Inicialización y cliente ioredis
    ├── types/
    │   └── task.ts          # Interfaces de TypeScript (Task, DTOs)
    ├── services/
    │   └── taskService.ts   # Capa de servicio con operaciones Redis (HSET, HGETALL, HDEL)
    ├── controllers/
    │   └── taskController.ts# Manejadores de solicitudes HTTP y respuestas JSON
    └── routes/
        └── taskRoutes.ts    # Definición de endpoints REST (/tasks, /task, etc.)
```

---

## 🔑 Inicialización de Redis con `ioredis`

La conexión con Redis se maneja de forma centralizada en [`src/config/redis.ts`](file:///c:/Users/Usuario/Documents/GitHub/To-Do-List-using-Ioredis/src/config/redis.ts):

```typescript
import { Redis } from 'ioredis';

export const redis = new Redis({
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy(times) {
    return Math.min(times * 100, 3000);
  }
});
```

### Modelo de Datos en Redis (Hashes)
Para almacenar las tareas eficientemente, la aplicación utiliza una **Hash Key** llamada `tasks`:
- **Comando `HSET tasks <id> <task_json>`**: Crea o actualiza una tarea en la hash table.
- **Comando `HGETALL tasks`**: Recupera todas las tareas guardadas.
- **Comando `HDEL tasks <id>`**: Elimina la tarea especificada por su ID.

Cada tarea se representa con el siguiente esquema JSON:
```json
{
  "id": "a5b3c2d1-e4f5-6789-0123-456789abcdef",
  "description": "Comprar insumos",
  "completed": false,
  "createdAt": "2026-08-18T20:00:00.000Z"
}
```

---

## 📡 Endpoints de la API REST

| Método | Endpoint | Descripción | Body (JSON) / Params |
| :--- | :--- | :--- | :--- |
| **GET** | `/tasks` | Obtener todas las tareas almacenadas en Redis | N/A |
| **POST** | `/task` | Crear y anotar una nueva tarea | `{ "description": "Texto de la tarea" }` |
| **PATCH** | `/task/:id` | Marcar como realizada o actualizar estado | `{ "completed": true }` |
| **DELETE** | `/task/:id` | Descartar / eliminar una tarea por su ID | Parámetro en la URL: `:id` |

---

## ⚡ Guía de Instalación y Ejecución

### 1. Requisitos Previos
- **Node.js** (v18 o superior)
- **npm**
- Servidor **Redis** en ejecución (vía Docker o instalación nativa local).

### 2. Iniciar el servidor Redis
Si utilizas Docker, ejecuta:
```bash
docker-compose up -d
```
O bien inicia tu servicio local de Redis en el puerto por defecto `6379`.

### 3. Instalar dependencias del proyecto
```bash
npm install
```

### 4. Iniciar el servidor backend en modo desarrollo
```bash
npm run dev
```

El servidor iniciará en: **`http://localhost:3000`**

### 5. Acceder a la aplicación Frontend
Abre tu navegador e ingresa a `http://localhost:3000` para ver la interfaz interactiva consumiendo la API de Redis en tiempo real.

---

## 🌐 Conexión Frontend -> Backend

El archivo [`public/app.js`](file:///c:/Users/Usuario/Documents/GitHub/To-Do-List-using-Ioredis/public/app.js) utiliza el API estándar `fetch()` para interactuar con la API REST:

- **Crear tarea**: Envía un `POST /task` con el cuerpo `{ description }`.
- **Marcar como realizada**: Envía un `PATCH /task/:id` con `{ completed: true }`.
- **Descartar tarea**: Envía un `DELETE /task/:id`.
- **Visualización en tiempo real**: Carga automáticamente las tareas desde Redis al ingresar a la página y actualiza los contadores dinámicos.

---

## 📦 Compilación para Producción

Para compilar el proyecto TypeScript a JavaScript:
```bash
npm run build
npm start
```
