# To-Do List usando Redis y ioredis (Node.js + Express + TypeScript + Docker Compose + Nginx)

Una aplicación web de lista de tareas (To-Do) moderna, modular y completa construida con **TypeScript**, **Express**, **ioredis** para persistencia en base de datos Redis en memoria, y un reverse proxy **Nginx** orquestado mediante **Docker Compose**.

---

## 🚀 Arquitectura y Tecnologías

```
                        +----------------------------+
                        |  Cliente Web (Navegador)   |
                        +--------------+-------------+
                                       |
                  +--------------------+--------------------+
                  |                                         |
                  v (http://localhost:3001)                 v (http://localhost:3002)
        +----------------------------+            +----------------------------+
        |   Nginx Frontend App 1     |            |   Nginx Frontend App 2     |
        |   (APP_INSTANCE=app1)      |            |   (APP_INSTANCE=app2)      |
        +-------------+--------------+            +-------------+--------------+
                      |                                         |
                      +-------------------+---------------------+
                                          | (Reverse Proxy /task, /tasks)
                                          v
                                +-------------------+
                                |  Backend Express  |
                                |   (Puerto 5001)   |
                                +---------+---------+
                                          | (ioredis)
                                          v
                                +-------------------+
                                |     Redis DB      |
                                |   (Puerto 6379)   |
                                +-------------------+
```

- **Frontend**: HTML5, CSS3 (glassmorphism y microanimaciones), Vanilla JavaScript.
- **Backend**: Node.js, Express, TypeScript (escuchando en el puerto **5001**).
- **Base de Datos**: Redis (imagen `redis:alpine`) en memoria utilizando `ioredis`.
- **Instancias de Frontend**:
  - **`frontend_app1`**: Escucha en el puerto **3001** con la variable de entorno `APP_INSTANCE=app1`. Muestra **"Bienvenido a app1"**.
  - **`frontend_app2`**: Escucha en el puerto **3002** con la variable de entorno `APP_INSTANCE=app2`. Muestra **"Bienvenido a app2"**.

---

## 🛠️ Estructura del Proyecto

```
To-Do-List-using-Ioredis/
├── docker-compose.yml       # Orquestación de contenedores (Redis -> Backend -> Frontend App1 & App2)
├── Dockerfile               # Dockerfile para el Backend en TypeScript (Puerto 5001)
├── nginx/
│   ├── Dockerfile           # Dockerfile para el Frontend + Nginx Reverse Proxy
│   └── nginx.conf.template  # Plantilla de Nginx procesada dinámicamente con envsubst ($APP_INSTANCE)
├── package.json             # Dependencias y scripts
├── tsconfig.json            # Configuración del compilador TypeScript
├── .env.example             # Variables de entorno de ejemplo
├── .env                     # Variables de entorno locales / producción
├── README.md                # Documentación del proyecto
├── public/                  # Archivos estáticos del frontend
│   ├── index.html           # Interfaz web principal
│   ├── style.css            # Estilos CSS
│   └── app.js               # Cliente JavaScript que consume la API REST y /instance
└── src/                     # Código fuente del Backend
    ├── server.ts            # Servidor HTTP en puerto 5001
    ├── app.ts               # Express, middlewares, healthcheck (/health) y rutas
    ├── config/
    │   └── redis.ts         # Cliente ioredis y conexión a Redis
    ├── types/
    │   └── task.ts          # Tipos e interfaces de TypeScript
    ├── services/
    │   └── taskService.ts   # Capa de servicio con comandos Redis (HSET, HGETALL, HDEL)
    ├── controllers/
    │   └── taskController.ts# Lógica de controladores HTTP (POST, DELETE, PATCH, GET)
    └── routes/
        └── taskRoutes.ts    # Definición de endpoints REST (/tasks, /task)
```

---

## 📡 Endpoints de la API REST (Puerto 5001)

| Método | Endpoint | Descripción | Body (JSON) / Params |
| :--- | :--- | :--- | :--- |
| **GET** | `/tasks` | Obtener todas las tareas almacenadas en Redis | N/A |
| **POST** | `/task` | Anotar una nueva tarea | `{ "description": "Texto de la tarea" }` |
| **PATCH** | `/task/:id` | Marcar como realizada o actualizar estado | `{ "completed": true }` |
| **DELETE** | `/task/:id` | Descartar / eliminar una tarea por su ID | Parámetro en la URL: `:id` |
| **GET** | `/health` | Endpoint de salud para comprobaciones de Docker | N/A |

---

## 🐳 Despliegue con Docker Compose

La secuencia de inicio de los contenedores se ejecuta de forma ordenada mediante `healthcheck` y `depends_on`:
**`Redis` → `Backend` → `Frontend App1` & `Frontend App2`**

### Comando de inicio:
```bash
docker compose up --build
```

### Puertos e Instancias disponibles:
- **App 1**: [http://localhost:3001](http://localhost:3001) (Muestra *"Bienvenido a app1"*)
- **App 2**: [http://localhost:3002](http://localhost:3002) (Muestra *"Bienvenido a app2"*)
- **Backend API REST**: [http://localhost:5001](http://localhost:5001)
- **Redis DB**: `localhost:6379`
