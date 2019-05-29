import { Application as Express } from "express";
import { config } from "dotenv";
import bodyParser from "body-parser";
import { AppInit } from "../decorators/application";
import { ExpressServer } from "../express/server";
import Connector from "../sequelize/Connector";
import KafkaClient from "../kafka/KafkaClient";
import "../../modules/middleware";
import "../../modules/presenters";
import "../../modules/middleware/errors";

config({path: `${__dirname}/../../../../env.local`});

export abstract class Application {

    public app: Express;

    protected db: Connector;
    protected kafka: KafkaClient;
    protected server: ExpressServer;

    abstract main(): void;

    @AppInit
    protected createApp(): void {
        this.app.set("trust proxy", 1);
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.raw());
        this.app.use(bodyParser.text());
    }

    abstract destroy(): void;
}
