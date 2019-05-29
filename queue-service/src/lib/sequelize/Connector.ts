import { Model, Sequelize } from "sequelize";
import Debug, { IDebugger } from "debug";
import models from "../../models";

export default class Connector {
    private static instance: Connector;
    public app: Sequelize;
    private jobs: Promise<any>[] = [];
    private readonly debug: IDebugger;

    constructor() {
        this.debug = Debug(`${process.env.NODE_NAME}`);

        if (!this.app) {
            this.app = new Sequelize(process.env.DB_HOST, {dialect: "mysql", logging: false});
            this.jobs.push(this.app.authenticate());
        }
    }

    public static getInstance() {
        if (!Connector.instance) {
            Connector.instance = new Connector();
        }

        return Connector.instance;
    }

    public init() {
        Promise.all(this.jobs).then(() => this.setup()).then(() => {
            this.debug("init tools succeeded:");
        }).catch((err: Error) => {
            this.debug("Unable to init tools:", err);
            throw err;
        });
        return this;
    }

    public setup() {
        Promise.all(this.jobs).then(() => this.jobs = models.map((model: {
            init: (sequelize: Sequelize) => Promise<Model>
        }): Promise<Model> => {
            return model.init(this.app);
        }));
        return this;
    }

    public model<T>(name: string): undefined | Model<T, T> | any {
        return this.app.models[name] as undefined as Model<T, T> as any;
    }
}
