import kafkaNode, { ProduceRequest, ProducerOptions } from "kafka-node";
import Debug, { IDebugger } from "debug";
import ms from "ms";
import KafkaClient from "./KafkaClient";

let debug: IDebugger;

const defaultOptions: ProducerOptions = {
    requireAcks: 1,
    ackTimeoutMs: ms("1 day"),
};

export default class Producer {
    private static instance: Producer;
    public session: kafkaNode.Producer;
    private jobs: Promise<void>[] = [];
    private readonly debug: IDebugger;

    constructor() {
        this.debug = debug || Debug(`${process.env.NODE_NAME}`);

        if (!this.session) {
            this.session = new kafkaNode.Producer(KafkaClient.getInstance().session, defaultOptions);
        }
    }

    public static getInstance() {
        if (!Producer.instance) {
            Producer.instance = new Producer();
        }

        return Producer.instance;
    }

    public send = (payloads: ProduceRequest[]): Promise<void> => new Promise((resolve: (data: any) => void, reject: (reason: Error) => void) => {
        this.session.send(payloads, (error: any, data: any): void => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
}
