import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-body";

import * as T from "../../service/signup/type";

import * as SignupService from "../../service/signup";
import * as SignupNotificationService from "../../service/signup/notification";
import * as CountryService from "../../service/geo/country";

import { Main as Validation } from "@nexys/validation";

import * as SignupS from "./shape";

const router: Router = new Router();

router.all("/country", async (ctx: Koa.Context) => {
  ctx.body = await CountryService.listUOptionSet();
});

router.post(
  "/company",
  bodyParser(),
  Validation.isShapeMiddleware(SignupS.ShapeSearch),
  async (ctx: Koa.Context) => {
    const { searchString, countryCode } = ctx.request.body;
    const c = await SignupService.company(searchString, countryCode);
    ctx.body = c;
  }
);

router.post(
  "/notification/list",
  bodyParser(),
  Validation.isUuid,
  async (ctx: Koa.Context) => {
    ctx.body = await SignupNotificationService.list(ctx.request.body.uuid);
  }
);

// router.post('/tssme/notification/complete', bodyParser(), Validation.isShapeMiddleware(SignupS.ShapeNotifications), async (ctx: Koa.Context) => {
//   interface Profile {
//     profile: {
//       firstName:string,
//       lastName:string,
//       email:string
//     },
//     businessPartner:{
//       name: string, ceid: string, country: {iso: string}
//     }
//   }

//   const secretKeySignup = 'xx'
//   const aString = JWT.sign(a, secretKeySignup);

//   ctx.redirect('https://tssme/signup/process/end?q='+aString);

// });

router.post(
  "/notification/complete",
  bodyParser(),
  Validation.isShapeMiddleware(SignupS.ShapeNotifications),
  async (ctx: Koa.Context) => {
    const userCache = await SignupNotificationService.updateAndLogin(
      ctx.request.body
    );
    if ("redirect" in userCache) {
      ctx.body = { redirectUrl: userCache.redirect };
      return;
    }

    ctx.body = userCache;
  }
);

router.post(
  "/ibm",
  bodyParser(),
  Validation.isShapeMiddleware(SignupS.ShapeSignupIbm),
  async (ctx: Koa.Context) => {
    const s: T.Signup = ctx.request.body;

    ctx.body = await SignupService.signupIbmUser(s.profile, s.app);
  }
);

router.post(
  "/",
  bodyParser(),
  Validation.isShapeMiddleware(SignupS.ShapeSignup),
  async (ctx: Koa.Context) => {
    const s: T.Signup = ctx.request.body;

    ctx.body = await SignupService.signupSubmission(s);
  }
);

export default router.routes();
