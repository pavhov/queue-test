import { createServer, Server as HttpServer } from "http";
import { Application } from "express";
import Debug, { IDebugger } from "debug";

export class ExpressServer {
    protected ip: string;
    protected port: number;
    protected server: HttpServer;
    private readonly debug: IDebugger;

    public constructor(app: Application) {
        this.debug = Debug(`${process.env.NODE_NAME}`);
        this.server = createServer(app);
    }

    public listen() {
        this.ip = process.env.IP_ADDRESS;
        this.port = parseInt(process.env.PORT);

        this.server.listen(this.port, this.ip);

        this.server.on("error", err => {
            this.debug(`Unable to start http server http://${this.ip}:${this.port}`);
        });
        this.server.on("listening", () => {
            this.debug(`http server started on http://${this.ip}:${this.port}`);
        });

        return this;
    }
}
