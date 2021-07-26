import Router from "koa-router";
import { App } from "./index";

import { Github, Routes as SSORoutes } from "@nexys/oauth";

const app = App();

export const startApp = async (port: number) => {
  app.listen(port, () => console.log(`Server started at port ${port}`));
};

const router = new Router();

const client_id = "6763ce57887aaf5a2197";
const client_secret = "7d34944b9f420a950eb52a9447627702bc1685fe";

//const client_id =
("273911563200-0gpfjngglbsjaevmd8sttc54km56d33l.apps.googleusercontent.com");
//const client_secret = "OQZGZR5xmLuPoh9W6pIuPBsb";

const redirectPath = "/sso/github/redirect";

const gh = new Github(
  client_id,
  client_secret,
  "http://localhost:3000" + redirectPath
);
/*
const ggle = new Google(
  client_id,
  client_secret,
  "http://localhost:3000" + redirectPath
);*/

/*ssoRoutes(router, gh, undefined, {
  redirect: redirectPath,
  url: "/url",
});*/

SSORoutes(router, gh, undefined, {
  redirect: redirectPath,
  url: "/url",
});

router.get("/red", (ctx) => {
  ctx.redirect(gh.oAuthUrl());
});

app.use(router.routes());

startApp(3000);
