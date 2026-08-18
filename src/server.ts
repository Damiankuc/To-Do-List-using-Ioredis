import app from './app.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`🚀 Servidor To-Do corriendo en http://localhost:${PORT}`);
  console.log(`📌 API Endpoints:`);
  console.log(`   - GET    /tasks     (Listar tareas)`);
  console.log(`   - POST   /task      (Crear tarea)`);
  console.log(`   - PATCH  /task/:id  (Marcar realizada/editar)`);
  console.log(`   - DELETE /task/:id  (Descartar tarea)`);
  console.log(`==================================================`);
});
