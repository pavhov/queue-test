import { QueryInterface, DataTypes, Promise } from "sequelize";

export default {
  up: (sequelize: QueryInterface): Promise<void> | any => {
    return sequelize.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      first_name: {
        type: DataTypes.STRING
      },
      last_name: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING
      },
      gender: {
        type: DataTypes.STRING,
      },
      country: {
        type: DataTypes.STRING
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    }).then(() =>  sequelize.addIndex("users", ["gender", "country"]).catch(() => {}));
  },
  down: (sequelize: QueryInterface) => {
    return sequelize.dropTable("users");
  }
};
