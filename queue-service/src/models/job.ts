import ajv, { Ajv, ValidateFunction } from "ajv";
import { DataTypes, Model, Sequelize } from "sequelize";
import { Email } from "./email";
import { User } from "./user";

export class Job extends Model {
  public id!: number;
  public name!: string;
  public time!: number;
  public count!: number;
  public done!: number;
  public info!: string | any;
  public status!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

export const init = (sequelize: Sequelize) => {
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
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING
    },
  }, {
    sequelize,
    tableName: "jobs",
    modelName: "jobs",
  });

  return Job.sync();
};

export const association = async (sequelize: Sequelize): Promise<void> => {
};

const validator: Ajv = new ajv({removeAdditional: true, useDefaults: true});
const createSchema: ValidateFunction = validator.compile({
  type: "object",
  additionalProperties: false,
  properties: {
    name: {
      type: "string",
    },
    time: {
      type: "number",
    },
    count: {
      type: "number",
    },
    don: {
      type: "number",
    },
    info: {
      type: "object",
      properties: {
        users: {
          type: "object",
          properties: {
            gender: {
              type: "string",
            },
            country: {
              type: "string",
            },
          }
        },
        type: {
          type: "string",
        },
        job: {
          type: "object",
          properties: {
            heading: {
              type: "string",
            },
            body: {
              type: "string",
            },
          },
        },
      },
    },
    status: {
      type: "string",
      enum: [
        "not-started", "pending", "completed",
      ],
      default: "not-started",
    },
  },
  required: ["name", "info",]
});

export const validate = {
  create: createSchema
};
