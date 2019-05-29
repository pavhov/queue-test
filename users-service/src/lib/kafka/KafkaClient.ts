import kafkaNode, { KafkaClientOptions } from "kafka-node";
import Debug, { IDebugger } from "debug";
import topics from "../../config/topics.json";

export default class KafkaClient {
    private static instance: KafkaClient;
    public session: kafkaNode.KafkaClient;
    private jobs: Promise<void>[] = [];
    private readonly debug: IDebugger;

    constructor() {
        this.debug = Debug(`${process.env.NODE_NAME}`);

        if (!this.session) {
            const defaultOptions: KafkaClientOptions = {
                kafkaHost: process.env.KAFKA,
                requestTimeout: 100000,
            };

            this.session = new kafkaNode.KafkaClient(defaultOptions);
            this.jobs.push(new Promise((resolve: () => void, reject: (reason: Error) => void) => {
                this.session.on("ready", (): void => {
                    this.debug("kafka client connected successful");
                    resolve();
                });

                this.session.on("error", (error: Error): void => {
                    this.debug(`Unable connect to kafka client:`, error);
                    reject(error);
                });
            }));
        }
    }

    public static getInstance() {
        if (!KafkaClient.instance) {
            KafkaClient.instance = new KafkaClient();
        }

        return KafkaClient.instance;
    }

    public init() {
        Promise.all(this.jobs).then(() => {
            this.jobs = [new Promise((resolve: () => void, reject: (reason: Error) => void) => {
                this.session.createTopics(topics, (error: Error, result: any) => {
                    if (error) {
                        this.debug(`kafka client create topics error:`, error);
                        reject(error);
                    } else {
                        resolve();
                    }
                })
            })];
        }).catch((reason: Error) => {
            this.debug(`kafka client error:`, reason);
        });
        return this;
    }
}
