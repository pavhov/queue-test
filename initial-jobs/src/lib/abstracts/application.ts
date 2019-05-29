import { config } from "dotenv";

config({path: `${__dirname}/../../../../env.local`});

export abstract class Application {
    abstract main(): void;

    abstract destroy(): void;
}
