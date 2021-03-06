import { DataTypes, Model, Sequelize } from "sequelize";
import { User } from "./user";

export class Email extends Model {
  public id!: number;
  public job_id!: number;
  public user_id!: number;
  public heading!: string;
  public body!: string;
  public done!: Date;
  public info!: string;
  public status!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const init = (sequelize: Sequelize) => {
  Email.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    job_id: {
      type: DataTypes.INTEGER,
      references: {model: "Job", key: "id"}
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {model: "User", key: "id"}
    },
    heading: {
      type: DataTypes.TEXT
    },
    body: {
      type: DataTypes.TEXT
    },
    done: {
      type: DataTypes.INTEGER
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
  }, {
    sequelize,
    tableName: "emails",
    modelName: "email",
  });

  return Email.sync();
};

export const association = async (sequelize: Sequelize): Promise<void> => {
};
