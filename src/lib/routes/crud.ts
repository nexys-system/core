import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-body";

import MiddlewareConstraints from "../query/constraint/middleware";

import { Entity } from "../query/model/type";
import * as T from "../query/constraint/type";
import QueryService from "../query/service";
import * as FT from "@nexys/fetchr/dist/type";
import m from "../middleware/auth";
import { ObjectWithId } from "../type";
import { Permissions } from "../middleware/auth/type";

class CrudRoutes<
  Profile extends ObjectWithId<Id>,
  UserCache extends Permissions,
  Id
> {
  model: Entity[];
  router: Router;
  constructor(
    model: Entity[],
    qs: QueryService,
    MiddlewareAuth: m<Profile, UserCache, Id>
  ) {
    this.model = model;

    const middleware = new MiddlewareConstraints(this.model);

    const router: Router = new Router();

    router.post(
      "/:role/data",
      bodyParser(),
      MiddlewareAuth.isAuthenticated(),
      middleware.roleExists,
      async (ctx: Koa.Context) => {
        const query: FT.Query = ctx.request.body;

        console.log(query);

        const { constraints } = ctx.state as {
          constraints: {
            data: T.QueryConstraint;
            mutate: T.MutateConstraint;
          };
        };

        ctx.body = await qs.dataWithConstraint(query, constraints.data, model);
      }
    );

    router.post(
      "/:role/mutate",
      bodyParser(),
      MiddlewareAuth.isAuthenticated(),
      middleware.roleExists,
      async (ctx: Koa.Context) => {
        const profile: T.Profile = ctx.state.profile as T.Profile;
        const query: FT.Mutate = ctx.request.body;

        const { constraints } = ctx.state as {
          constraints: {
            data: T.QueryConstraint;
            mutate: T.MutateConstraint;
          };
        };

        const { body, status } = await qs.mutateWithConstraint(
          query,
          constraints.mutate
        );

        ctx.status = status;
        ctx.body = body;
      }
    );

    this.router = router;
  }
}

export default CrudRoutes;
