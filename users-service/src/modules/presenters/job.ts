import { NextFunction, Request, Response } from "express";
import { KeyedMessage } from "kafka-node";
import { Method, Presenter } from "../../lib/decorators/application";
import { Job as JobModel, validate } from "../../models/job";
import Producer from "../../lib/kafka/Producer";

@Presenter("/job")
export class Job {
    @Method("get", "/")
    private async list(req: Request, res: Response, next: NextFunction) {
        try {
            let result: JobModel[] = await JobModel.findAll({offset: parseInt(req.query.offset || 0), limit: parseInt(req.query.limit || 15), raw: true});

            res.json({data: result, meta: {offset: req.query.offset || 0, limit: req.query.limit || 15}});
        } catch (e) {
            next({
                status: e.status,
                name: e.name,
                message: e.message,
                stack: e.stack,
            });
        }
    }

    @Method("get", "/:id")
    private async one(req: Request, res: Response, next: NextFunction) {
        try {
            let result: JobModel = await JobModel.findOne({where: {id: req.params.id}, raw: true});

            res.json({data: result});
        } catch (e) {
            next({
                status: e.status,
                name: e.name,
                message: e.message,
                stack: e.stack,
            });
        }
    }

    @Method("post", "/")
    private async create(req: Request, res: Response, next: NextFunction) {
        try {
            let createSchema = validate.create;
            let createStatus = await createSchema(req.body);
            if (!createStatus) {
                return next({
                    name: "ValidationError",
                    status: 400,
                    message: createSchema.errors,
                    stack: new Error("ValidationError").stack,
                });
            }

            req.body.info = JSON.stringify(req.body.info);
            let result: JobModel = await JobModel.create(req.body);

            await Producer.getInstance().send([{
                topic: "jobs",
                messages: [new KeyedMessage("email", JSON.stringify(result))],
                key: req.body.info.type,
                partition: 0,
            }]);
            res.json({data: result});
        } catch (e) {
            next({
                status: e.status,
                name: e.name,
                message: e.message,
                stack: e.stack,
            });
        }
    }

    @Method("put", "/:id")
    private async update(req: Request, res: Response, next: NextFunction) {
        try {
            let result: [number, JobModel[]] = await JobModel.update(req.body, {where: {id: req.params.id}, returning: true});

            res.json({data: result});
        } catch (e) {
            next({
                status: e.status,
                name: e.name,
                message: e.message,
                stack: e.stack,
            });
        }
    }

    @Method("delete", "/:id")
    private async remove(req: Request, res: Response, next: NextFunction) {
        try {
            let result: number = await JobModel.destroy({where: {id: req.params.id}});

            res.json({data: result});
        } catch (e) {
            next({
                status: e.status,
                name: e.name,
                message: e.message,
                stack: e.stack,
            });
        }
    }
}
