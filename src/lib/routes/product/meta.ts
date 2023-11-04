/**
 * collection routes displaying/managing meta information
 */
import Koa from "koa";
import Router from "@koa/router";

// Where everyday CLI arguments are concerned, you'll want to skip the first two.
// @see https://nodejs.org/en/knowledge/command-line/how-to-parse-command-line-arguments/
const argvs: string[] = process.argv.slice(2);
const sha: string = argvs[0] || "git_undefined_app_arg";
const version: string = argvs[1] || "git_version_undefined_app_arg";

const date = new Date();

export default () => {
  const router: Router = new Router();

  router.get("/version", async (ctx: Koa.Context) => {
    ctx.body = { sha, version, date };
  });

  return router.routes();
};
