# To-Do List usando Redis y ioredis (Node.js + Express + TypeScript + Docker Compose + Nginx)

Una aplicación web de lista de tareas (To-Do) moderna, modular y completa construida con **TypeScript**, **Express**, **ioredis** para persistencia en base de datos Redis en memoria, y un reverse proxy **Nginx** orquestado mediante **Docker Compose** con **Gateway de Alta Disponibilidad (Failover)**.

---

## 🚀 Arquitectura y Tecnologías

```
                        +----------------------------+
                        |  Cliente Web (Navegador)   |
                        +--------------+-------------+
                                       | (http://localhost:3000)
                                       v
                        +----------------------------+
                        |       Nginx Gateway        |
                        |   (Upstream con Backup)    |
                        +--------------+-------------+
                                       |
                   +-------------------+-------------------+
                   | (Principal)                           | (Backup automático)
                   v (http://localhost:3001)               v (http://localhost:3002)
        +----------------------------+          +----------------------------+
        |   Nginx Frontend App 1     |          |   Nginx Frontend App 2     |
        |   (APP_INSTANCE=app1)      |          |   (APP_INSTANCE=app2)      |
        +-------------+--------------+          +-------------+--------------+
                      |                                       |
                      +------------------+--------------------+
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
  - **`frontend_app1`**: Escucha en el puerto **3001** con `APP_INSTANCE=app1` (Muestra *"Bienvenido a app1"*).
  - **`frontend_app2`**: Escucha en el puerto **3002** con `APP_INSTANCE=app2` (Muestra *"Bienvenido a app2"*).
- **Gateway (Failover)**:
  - Escucha en el puerto **3000**. Redirige por defecto a `app1`. Si `app1` se apaga (`docker stop todo_frontend_app1`), conmuta automáticamente a `app2`.

---

## 🧪 Prueba de Conmutación por Error (Failover)

1. Levantar contenedores:
   ```bash
   docker compose up --build -d
   ```
2. Abrir en el navegador: [http://localhost:3000](http://localhost:3000) $\rightarrow$ Verás **"Bienvenido a app1"**.
3. Simular caída de `app1`:
   ```bash
   docker stop todo_frontend_app1
   ```
4. Recargar [http://localhost:3000](http://localhost:3000) $\rightarrow$ Verás automáticamente **"Bienvenido a app2"**.
5. Restablecer `app1`:
   ```bash
   docker start todo_frontend_app1
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

## 🐳 Puertos Disponibles

- **Gateway HA (Failover Automatico)**: [http://localhost:3000](http://localhost:3000)
- **App 1 Directo**: [http://localhost:3001](http://localhost:3001)
- **App 2 Directo**: [http://localhost:3002](http://localhost:3002)
- **Backend API REST**: [http://localhost:5001](http://localhost:5001)
- **Redis DB**: `localhost:6379`
