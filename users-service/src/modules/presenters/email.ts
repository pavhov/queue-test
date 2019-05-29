import { Request, Response, NextFunction } from "express";
import { Method, Presenter } from "../../lib/decorators/application";
import { Email as EmailModel } from "../../models/email";

@Presenter("/email")
export class Email {
    @Method("get", "/")
    private async list(req: Request, res: Response, next: NextFunction) {
        try {
            let result: EmailModel[] = await EmailModel.findAll({offset: parseInt(req.query.offset || 0), limit: parseInt(req.query.limit || 15), raw: true});

            res.json({data:result, meta: { offset:  req.query.offset || 0, limit: req.query.limit || 15}});
        } catch (e) {
            next({
                status: e.status,
                name: e.name,
                message: e.message,
                stack: e.stack,
            })
        }
    }

    @Method("get", "/:id")
    private async one(req: Request, res: Response, next: NextFunction) {
        try {
            let result: EmailModel = await EmailModel.findOne({where: {id: req.params.id}, raw: true});

            res.json({data:result});
        } catch (e) {
            next({
                status: e.status,
                name: e.name,
                message: e.message,
                stack: e.stack,
            })
        }
    }

    @Method("post", "/")
    private async create(req: Request, res: Response, next: NextFunction) {
        try {
            let result: EmailModel = await EmailModel.create(req.body);

            res.json({data:result});
        } catch (e) {
            next({
                status: e.status,
                name: e.name,
                message: e.message,
                stack: e.stack,
            })
        }
    }

    @Method("put", "/:id")
    private async update(req: Request, res: Response, next: NextFunction) {
        try {
            let result: [number, EmailModel[]] = await EmailModel.update(req.body, {where: {id: req.params.id}, returning: true});

            res.json({data:result});
        } catch (e) {
            next({
                status: e.status,
                name: e.name,
                message: e.message,
                stack: e.stack,
            })
        }
    }

    @Method("delete", "/:id")
    private async remove(req: Request, res: Response, next: NextFunction) {
        try {
            let result: number = await EmailModel.destroy({where: {id: req.params.id}});

            res.json({data:result});
        } catch (e) {
            next({
                status: e.status,
                name: e.name,
                message: e.message,
                stack: e.stack,
            })
        }
    }
}
