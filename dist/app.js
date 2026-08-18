import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import taskRoutes from './routes/taskRoutes.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Servir archivos estáticos del frontend desde la carpeta 'public'
const publicPath = path.join(__dirname, '..', 'public');
app.use(express.static(publicPath));
// Rutas de la API
app.use('/', taskRoutes);
// Ruta fallback para servir el index.html en cualquier otra ruta no reconocida
app.get('*', (_req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});
export default app;
