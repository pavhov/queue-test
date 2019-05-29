import { DataTypes, Model, Promise, Sequelize } from "sequelize";

export class Job extends Model {
  public id!: number;
  public name!: string;
  public time!: number;
  public count!: number;
  public done!: number;
  public info!: string;
  public status!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const init = (sequelize: Sequelize): Promise<Model> => {
  Job.init({
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
  }, {
    sequelize,
    tableName: "jobs",
  });

  return Job.sync();
};
