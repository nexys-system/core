import Router from "koa-router";
import { EmailService } from "./type";
import { HTTP } from "@nexys/http";

export default (emailService: EmailService) => {
  const router: Router = new Router();

  router.get("/", async (ctx) => {
    const { email }: { email: string } = ctx.query;

    if (!email) {
      throw new HTTP.Error("no email was given", 400);
    }

    ctx.body = await emailService.send([email], "hey", "hello");
  });

  return router.routes();
};
