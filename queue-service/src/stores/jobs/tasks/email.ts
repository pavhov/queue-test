import moment from "moment";
import { Op, Sequelize } from "sequelize";
import Debug, { IDebugger } from "debug";
import { Job } from "../../../models/job";
import { User } from "../../../models/user";
import { Email as EmailModel } from "../../../models/email";

const debug = Debug(`${process.env.NODE_NAME}`);

const Email = async (job: Job, done: (err?: Error) => void) => {
    let data: Job = Object.assign({}, job);
    data.info = JSON.parse(data.info);
    debug("email job started");

    let startTime = Date.now();
    let currentJob: Job = await Job.findOne({
        where: {
            id: data.id,
            status: {
                [Op.ne]: "completed",
            },
        }, raw: true,
    });
    if (currentJob) {
        try {
            data.info.users.where[Op.and] = Sequelize.literal("(SELECT COUNT(*) FROM emails WHERE `emails`.`user_id` = `user`.`id` AND `emails`.`status` = 'not-send' AND `emails`.`job_id` = '" + data.id + "') = 0");
            let users = await User.findAll({
                where: data.info.users.where,
                offset: currentJob.done,
                limit: currentJob.count,
                raw: true,
            });
            if (currentJob.status === "not-started") {
                await Job.update({status: "pending", count: users.length}, {where: {id: currentJob.id}});
            }

            debug(users.length);
            while (users.length) {
                let groups: User[] = users.splice(0, 10000);
                debug(users.length);

                let emails: EmailModel[] = await createEmails(groups, data);
                await sendEmails(emails);
                let endTime = Date.now();
                await Job.update({
                    status: "processing",
                    time: endTime - startTime,
                    done: Sequelize.literal(`done + ${groups.length}`)
                }, {where: {id: currentJob.id}});
            }

            let endTime = Date.now();
            await Job.update({status: "completed", time: endTime - startTime}, {where: {id: currentJob.id}});
            debug("email job completed");
            done();
        } catch (e) {
            done(e);
        }
    }
};

const createEmails = async (groups: User[], job: {id: number; info: {job: { id: number; heading: string; body: string }}}) => {
    return EmailModel.bulkCreate(new Proxy(groups, {
        get(target: User[], p: any, receiver: any): any {
            if (typeof target[p] === "object") {
                return {
                    heading: job.info.job.heading,
                    body: job.info.job.body,
                    job_id: job.id,
                    user_id: target[p].id,
                    status: "not-send",
                };
            } else {
                return target[p];
            }
        },
    }), {
        updateOnDuplicate: ["user_id", "status", "heading"],
    });
};

const sendEmails = async (groups: EmailModel[]) => {
    let responses: Promise<void>[] = [];
    let emails: any[] = [];
    while (groups.length) {
        let user: EmailModel = groups.splice(0, 1)[0];
        if (user) {
            responses.push(new Promise((resolve, reject) => {
                let statuses = [
                    "completed", "rejected",
                ];
                emails.push({
                    status: statuses[Math.floor(Math.random() * Math.floor(2))],
                    done: moment().format('YYYY-MM-DD HH:mm:ss'),
                    id: user.id,
                });
                setTimeout(() => resolve(), 100);
            }));
        }
    }
    await Promise.all(responses);
    return EmailModel.bulkCreate(emails, {
        fields: ["id", "status", "done"],
        updateOnDuplicate: ["id"],
    });
};

export default Email;
