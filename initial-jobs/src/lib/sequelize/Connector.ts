// @ts-ignore
import { QueryInterface, Sequelize } from "sequelize";
import * as Bluebird from "bluebird";
import Debug, { IDebugger } from "debug";
import migrations from "../../migrations";
import models from "../../models";


let debug: IDebugger;

export default class Connector {
    private static instance: Connector;
    public app: Sequelize;
    private jobs: Promise<void>[] = [];
    private readonly debug: IDebugger;

    constructor() {
        this.debug = debug || Debug(`${process.env.NODE_NAME}`);

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
        Promise.all(this.jobs).then(() => this.migrate().setup().seed()).then(() => {
            this.debug("init tools succeeded:");
        }).catch((err: Error) => {
            this.debug("Unable to init tools:", err);
            throw err;
        });
        return this;
    }

    public migrate() {
        Promise.all(this.jobs).then(() => this.jobs = migrations.map((migration: {
            up: (sequelize: QueryInterface) => Bluebird<void>,
            down: (sequelize: QueryInterface) => Bluebird<void>
        }): Bluebird<void> => migration.up(this.app.getQueryInterface()))).then(() => {
            this.debug("database migrate succeeded:");
        }).catch((err: Error) => {
            this.debug("Unable to migrate database:", err);
            throw err;
        });
        return this;
    }

    public seed() {
        Promise.all(this.jobs).then(async () => {
            let countries: string[] = ["Canada", "Armenia"];
            let gender: string[] = ["Male", "Female"];
            let users: any[] = [];
            for (let rowI: number = 0; rowI < 100000; rowI++) {
                users.push({
                    first_name: `test-${rowI}`,
                    last_name: `test-${rowI}`,
                    email: `test-${rowI}@mail.com`,
                    gender: gender[Math.floor(Math.random() * Math.floor(2))],
                    country: countries[Math.floor(Math.random() * Math.floor(2))],
                });
            }
            let model = this.app.model("User") as any;
            this.jobs = [model.bulkCreate(users).then(() => {
                this.debug("insert users succeeded:");
            }).catch((err: Error) => {
                this.debug("Unable to insert users:", err);
                throw err;
            })];
        });
        return this;
    }

    public setup() {
        Promise.all(this.jobs).then(() => this.jobs = models.map((model: {
                init: (sequelize: Sequelize) => Bluebird<any>
            }): Bluebird<any> => {
                return model.init(this.app);
            }));
        return this;
    }
}
