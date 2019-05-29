import { Consumer as IConsumer, Message, OffsetFetchRequest } from "kafka-node";
import Debug, { IDebugger } from "debug";
import consumers from "../../config/consumers.json";
import Consumer from "../../lib/kafka/Consumer";
import tasks from "./tasks";

const debug: IDebugger = Debug(`${process.env.NODE_NAME}-${process.env.KAFKA_DEBUG}`);

export default class Runner {
    private static instance: Runner;
    private storedTasks: { [key: string]: Function[] } = {};
    private runningConsumer: IConsumer;
    private runningTasks: { [key: string]: NodeJS.Timeout } = {};

    constructor() {
        this.runningConsumer = new Consumer(consumers.filter(
            (consumer: OffsetFetchRequest) => consumer.topic === "jobs")).session;

    }

    public static getInstance() {
        if (!Runner.instance) {
            Runner.instance = new Runner();
        }

        return Runner.instance;
    }

    public init() {
        this.runner();
        this.runningConsumer.on("message", (message: Message) => {
            if (tasks.hasOwnProperty((message.key as string))) {
                try {
                    if (typeof message.value === "string" && message.key in tasks) {
                        // @ts-ignore
                        this.storedTasks[message.key] = this.storedTasks[message.key] = [];
                        // @ts-ignore
                        this.storedTasks[message.key].push(tasks[message.key].bind(null, JSON.parse(message.value), ((m: Message, err: Error) => {
                            if (err) {
                                throw err;
                            }
                            const dateStart: number = Date.now();
                            this.runningConsumer.commit((err: Error, data: any) => {
                                const dateEnd: number = (new Date).getTime();
                                const used: number = process.memoryUsage().heapUsed / 1024 / 1024;

                                debug(JSON.stringify({
                                    task: m.key,
                                    commit: data,
                                    time: `${dateEnd - dateStart}ms`,
                                    memory: `${Math.round(used * 100) / 100}MB`,
                                }));
                            });
                        }).bind(null, message)));
                    }
                } catch {
                    debug("Task not found");
                }
            } else {
                debug("Task not found");
            }
        });

    }

    private runner() {
        Object.keys(tasks).forEach((task: string) => this.watcher(task));
    }

    private watcher(task: string) {
        return this.runningTasks[task] = setTimeout(async () => {
            this.storedTasks[task] = this.storedTasks[task] || [];
            if (this.storedTasks[task].length > 0) {
                let storedTask: Function = this.storedTasks[task].shift();
                try {
                    await storedTask();
                } catch (error) {
                    this.storedTasks[task].unshift(storedTask);
                    const dateStart: number = Date.now();
                    const dateEnd: number = (new Date).getTime();
                    const used: number = process.memoryUsage().heapUsed / 1024 / 1024;
                    debug(JSON.stringify({
                        error,
                        time: `${dateEnd - dateStart}ms`,
                        memory: `${Math.round(used * 100) / 100}MB`,
                    }));
                }
            }
            this.watcher(task);
        }, 100);
    }
}
