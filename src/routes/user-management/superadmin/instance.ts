import Router from "koa-router";
import bodyParser from "koa-body";
import Validation, { Utils as VU } from "@nexys/validation";

import m from "../../../middleware/auth";
import { Permissions } from "../../../middleware/auth/type";
import * as T from "../type";
import { ObjectWithId } from "../../../type";

const InstanceService = <
  Profile extends ObjectWithId<Id>,
  UserCache extends Permissions,
  Id
>(
  { instanceService }: T.Services,
  MiddlewareAuth: m<Profile, UserCache, Id>
) => {
  const router = new Router();

  router.get(
    "/list",
    bodyParser(),
    MiddlewareAuth.isAuthorized("superadmin"),
    async (ctx) => {
      ctx.body = await instanceService.list();
    }
  );

  router.post(
    "/detail",
    bodyParser(),
    MiddlewareAuth.isAuthorized("superadmin"),
    Validation.isShapeMiddleware({
      uuid: { extraCheck: VU.checkUuid },
    }),
    async (ctx) => {
      const { uuid } = ctx.request.body;
      ctx.body = await instanceService.detail(uuid);
    }
  );

  router.post(
    "/insert",
    bodyParser(),
    MiddlewareAuth.isAuthorized("superadmin"),
    Validation.isShapeMiddleware({
      name: {},
      dateAdded: { type: "string" },
    }),
    async (ctx) => {
      const { name } = ctx.request.body;
      ctx.body = await instanceService.insert(name);
    }
  );

  router.post(
    "/update",
    bodyParser(),
    MiddlewareAuth.isAuthorized("superadmin"),
    Validation.isShapeMiddleware({
      uuid: { extraCheck: VU.checkUuid },
      name: {},
      dateAdded: { type: "string" },
    }),
    async (ctx) => {
      const { uuid, name } = ctx.request.body;
      ctx.body = await instanceService.update(uuid, name);
    }
  );

  router.post(
    "/delete",
    bodyParser(),
    MiddlewareAuth.isAuthorized("superadmin"),
    Validation.isShapeMiddleware({
      uuid: { extraCheck: VU.checkUuid },
    }),
    async (ctx) => {
      const { uuid } = ctx.request.body;

      ctx.request.body = ctx.body = await instanceService.delete(uuid);
    }
  );

  router.post(
    "/exists",
    bodyParser(),
    MiddlewareAuth.isAuthorized("superadmin"),
    Validation.isShapeMiddleware({
      name: {},
    }),
    async (ctx) => {
      const { name } = ctx.request.body;
      ctx.body = await instanceService.exists(name);
    }
  );

  return router.routes();
};

export default InstanceService;
