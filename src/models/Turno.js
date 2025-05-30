import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import { User } from './user.js';

export const Turno = sequelize.define('Turno', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  fecha: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  horario: {
    type: DataTypes.TIME,
    allowNull: false
  },
  estado: {
    type: DataTypes.ENUM('agendado','cancelado'),
    allowNull: false,
    defaultValue: 'agendado'
  }
}, {
  tableName: 'turnos',
  timestamps: true
});

Turno.belongsTo(User, {
  as: 'cliente',
  foreignKey: { name: 'clienteId', allowNull: false }
});
Turno.belongsTo(User, {
  as: 'barbero',
  foreignKey: { name: 'barberoId', allowNull: false }
});
