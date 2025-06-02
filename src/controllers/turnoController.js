import { Turno } from '../models/Turno.js';
import { User } from '../models/user.js';
import { sequelize } from '../config/db.js';

export async function agendarTurno(req, res) {
  try {
    const { fecha, horario, clienteId, barberoId } = req.body;

    if (!fecha || !horario || !clienteId || !barberoId) {
      return res.status(400).json({ message: 'Faltan datos obligatorios' });
    }
    const cliente = await User.findByPk(clienteId);
    const barbero = await User.findByPk(barberoId);
    if (!cliente || cliente.role !== 'cliente' ||
        !barbero   || barbero.role   !== 'barbero') {
      return res.status(400).json({ message: 'Cliente o barbero inválido' });
    }

    const turnoExistente = await Turno.findOne({
      where: {
        barberoId,
        fecha,
        horario,
        estado: 'agendado'            
      }
    });
    if (turnoExistente) {
      return res.status(400).json({
        message: `El barbero ya tiene un turno a las ${horario} del ${fecha}`
      });
    }

    const turno = await Turno.create({
      fecha,
      horario,
      clienteId,
      barberoId
    });
    res.status(201).json(turno);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al agendar turno', error: err.message });
  }
}


export async function cancelarTurno(req, res) {
  try {
    const { id } = req.params;
    const turno = await Turno.findByPk(id);
    if (!turno) {
      return res.status(404).json({ message: 'Turno no encontrado' });
    }

    turno.estado = 'cancelado';
    await turno.save();

    res.json({ message: 'Turno cancelado', turno });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al cancelar turno', error: err.message });
  }
}

export async function listarTurnos(req, res) {
  try {
    const { clienteId, barberoId } = req.query;
    const where = {};
    if (clienteId) where.clienteId = clienteId;
    if (barberoId) where.barberoId = barberoId;

    const turnos = await Turno.findAll({
      where,
      include: [
        { model: User, as: 'cliente', attributes: ['id','first_name','last_name'] },
        { model: User, as: 'barbero', attributes: ['id','first_name','last_name'] }
      ],
       order: [
        [sequelize.literal("FIELD(estado, 'agendado', 'cancelado', 'completed')"), 'ASC']
      ]
    });
    res.json(turnos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al listar turnos', error: err.message });
  }
}




// GET /turnos/barbero/:barberoId?fecha=YYYY-MM-DD
export async function listarTurnosPorBarbero(req, res) {
  try {
    const { barberoId } = req.params;
    const { fecha }     = req.query;

    // 1️⃣ Validaciones
    if (!fecha) {
      return res.status(400).json({ message: 'Debe especificar fecha en formato YYYY-MM-DD' });
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return res.status(400).json({ message: 'Formato de fecha inválido, usar YYYY-MM-DD' });
    }

    // 2️⃣ Verificar que exista y tenga rol 'barbero'
    const barbero = await User.findByPk(barberoId);
    if (!barbero || barbero.role !== 'barbero') {
      return res.status(404).json({ message: 'Barbero no encontrado o rol inválido' });
    }

    // 3️⃣ Traer todos los turnos agendados de ese día
    const turnos = await Turno.findAll({
      where: {
        barberoId,
        fecha,
        estado: 'agendado'
      },
      order: [['horario', 'ASC']],
      include: [
        {
          model: User,
          as: 'cliente',
          attributes: ['first_name', 'last_name', 'email']
        }
      ]
    });

    res.json(turnos);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: 'Error al listar turnos del barbero', error: err.message });
  }
}

