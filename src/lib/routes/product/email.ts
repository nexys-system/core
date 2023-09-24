import Router from "koa-router";
import { EmailService } from "./type";

export default (emailService: EmailService) => {
  const router: Router = new Router();

  router.get("/", async (ctx) => {
    const { email }: { email?: string } = ctx.query;

    if (!email) {
      throw new Error("no email was given");
    }

    if (typeof email !== "string") {
      throw Error("email is not of the right type");
    }

    ctx.body = await emailService.send([email], "hey", "hello");
  });

  return router.routes();
};
