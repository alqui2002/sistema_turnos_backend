import express from 'express';
import dotenv from 'dotenv';
import { sequelize } from './config/db.js';
import authRoutes from './routes/auth.js';
import turnoRoutes from './routes/turno.js';
import barberoRoutes from './routes/barbero.js';
import { validarJWT } from './middlewares/validarJWT.js';
import cors from 'cors';



dotenv.config();
const app = express();

app.use(
  cors({
    origin: 'http://localhost:5173'  
  })
);


app.use(express.json());

app.use('/auth', authRoutes);
app.use('/turnos', validarJWT,turnoRoutes);
app.use('/barberos',validarJWT, barberoRoutes);


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
