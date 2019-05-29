import { config } from "dotenv";
import Connector from "../sequelize/Connector";
import KafkaClient from "../kafka/KafkaClient";

config({path: `${__dirname}/../../../../env.local`});

export abstract class Application {

    protected db: Connector;
    protected kafka: KafkaClient;

    abstract main(): void;

    abstract destroy(): void;
}
