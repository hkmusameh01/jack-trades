import { DataTypes } from 'sequelize';
import sequelize from '../database/connection';
import { IRequest } from '../interfaces/models';

const Request = sequelize.define<IRequest>('Request', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  status: {
    type: DataTypes.ENUM,
    values: ['pending', 'success', 'fail'],
    allowNull: false,
  },
  is_exchangable: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  sender_approval: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: null,
  },
  receiver_approval: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: null,
  },
  products: {
    type: DataTypes.ARRAY(DataTypes.INTEGER),
    allowNull: false,
  },
}, { paranoid: true });

export default Request;
