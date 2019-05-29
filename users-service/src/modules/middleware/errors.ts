import { Middleware } from "../../lib/decorators/application";
import { Request, Response, NextFunction } from "express";

@Middleware
export class Errors {

    private NotFound(req: Request, res: Response, next: NextFunction) {
        let err: any = new Error("NotFound");

        err.status = 404;

        next(err);
    }

    private InternalError(err: any, req: Request, res: Response, next: NextFunction) {
        err.status = err.status || 500;
        res.status(err.status);

        res.send({
            status: err.status,
            name: err.name,
            message: err.message,
            stack: err.stack.split("\n"),
        });

    }
}
