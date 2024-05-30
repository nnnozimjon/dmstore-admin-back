import { DataTypes, Model } from 'sequelize';

import { sequelize } from '@config/db';
import { Merchant } from '@models/merchant-model';
import { Users } from '@models/users-model';

export class UserStores extends Model {
  id!: number;
  store_id!: number;
  user_id!: number;
  created_at!: Date;
}

UserStores.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    store_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'UserStores',
    tableName: 'user_stores',
    timestamps: false,
  }
);

UserStores.belongsTo(Merchant, { foreignKey: 'store_id' });
UserStores.belongsTo(Users, { foreignKey: 'user_id' });

Users.belongsTo(UserStores, { foreignKey: 'id', targetKey: 'user_id' });
Merchant.belongsTo(UserStores, { foreignKey: 'id', targetKey: 'store_id' });

export default UserStores;
