import kafkaNode, { ConsumerOptions, OffsetFetchRequest } from "kafka-node";
import util from "util";
import Debug, { IDebugger } from "debug";
import KafkaClient from "./KafkaClient";

let debug: IDebugger;

const defaultOptions: ConsumerOptions = {
    autoCommit: false,
};

export default class Consumer {
    public session: kafkaNode.Consumer;
    public readonly debug: IDebugger = Debug(`${process.env.NODE_NAME}`);

    constructor(consumer: Array<OffsetFetchRequest | string>) {
        this.session = new kafkaNode.Consumer(KafkaClient.getInstance().session, consumer, defaultOptions);
        this.session.close = util.promisify(this.session.close);

    }
}
