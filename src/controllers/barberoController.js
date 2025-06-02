import { Op } from 'sequelize';
import { User } from '../models/user.js';
import { Turno } from '../models/Turno.js';

export async function listarBarberos(req, res) {
  try {
    const barberos = await User.findAll({
      where: { role: 'barbero' },
      attributes: ['id', 'first_name', 'last_name', 'email']
    });
    res.json(barberos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al listar barberos', error: err.message });
  }
}

export async function getBarbero(req, res) {
  try {
    const { id } = req.params;

    const barbero = await User.findOne({
      where: {
        id,
        role: "barbero"
      },
      attributes: ["first_name", "last_name"]
    });

    if (!barbero) {
      return res.status(404).json({ message: "Barbero no encontrado" });
    }

    res.json(barbero);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al buscar barbero", error: err.message });
  }
}

export async function disponibilidadBarbero(req, res) {
  try {
    const barberoId = req.params.id;
    const fecha     = req.query.fecha;
    if (!fecha) {
      return res.status(400).json({ message: 'Debe especificar fecha en formato YYYY-MM-DD' });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return res.status(400).json({ message: 'Formato de fecha inválido, usar YYYY-MM-DD' });
    }

    const barbero = await User.findByPk(barberoId);
    if (!barbero || barbero.role !== 'barbero') {
      return res.status(404).json({ message: 'Barbero no encontrado o rol inválido' });
    }

    const HORARIOS = [
      '09:00:00','10:00:00','11:00:00',
      '12:00:00','13:00:00','14:00:00',
      '15:00:00','16:00:00','17:00:00',
      '18:00:00'
    ];

    // Traer turnos agendados de ese día
    const turnos = await Turno.findAll({
      where: {
        barberoId,
        fecha,
        estado: 'agendado'
      },
      attributes: ['horario']
    });

    const ocupados = turnos.map(t => t.horario);
    const libres   = HORARIOS.filter(h => !ocupados.includes(h));

    res.json({ fecha, libres });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener disponibilidad', error: err.message });
  }
}

