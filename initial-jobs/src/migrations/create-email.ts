import { QueryInterface, DataTypes, Promise } from "sequelize";

export default {
  up: (sequelize: QueryInterface): Promise<void> => {
    return sequelize.createTable("emails", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      job_id: {
        type: DataTypes.INTEGER({length: 11}),
        references: {model: "jobs", key: "id"}
      },
      user_id: {
        type: DataTypes.INTEGER({length: 11}),
        references: {model: "users", key: "id"}
      },
      heading: {
        type: DataTypes.TEXT
      },
      body: {
        type: DataTypes.TEXT
      },
      done: {
        type: DataTypes.DATE
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
    return sequelize.dropTable("emails");
  }
};
