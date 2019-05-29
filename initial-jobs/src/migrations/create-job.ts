import { Sequelize, QueryInterface, DataTypes, Promise } from "sequelize";

export default {
  up: (sequelize: QueryInterface): Promise<void> => {
    return sequelize.createTable("jobs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING
      },
      time: {
        type: DataTypes.INTEGER
      },
      count: {
        type: DataTypes.INTEGER
      },
      done: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      info: {
        type: DataTypes.STRING
      },
      status: {
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
    });
  },
  down: (sequelize: QueryInterface): Promise<void> => {
    return sequelize.dropTable("jobs");
  }
};
