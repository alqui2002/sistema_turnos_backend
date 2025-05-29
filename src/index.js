import express from 'express';
import dotenv from 'dotenv';
import { sequelize } from './config/db.js';
import authRoutes from './routes/auth.js';

dotenv.config();
const app = express();
app.use(express.json());

// Rutas
app.use('/auth', authRoutes);

// Conectar y sincronizar Sequelize
async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conectado a la base de datos MySQL');
    await sequelize.sync({ alter: true });
    console.log('✅ Tablas sincronizadas');
    
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
      console.log(`🚀 Backend escuchando en http://localhost:${port}`);
    });
  } catch (err) {
    console.error('❌ No se pudo iniciar el servidor', err);
  }
}

start();
