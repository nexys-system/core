import Koa from "koa";
import Router from "koa-router";
import bodyParser from "koa-body";

import MiddlewareConstraints from "./middleware";

import { Entity } from "../model/type";
import * as T from "../constraint/type";
import QueryService from "../service";
import * as FT from "@nexys/fetchr/dist/type";

class CrudRoutes {
  model: Entity[];
  constructor(model: Entity[], qs: QueryService) {
    this.model = model;

    const middleware = new MiddlewareConstraints(this.model);

    const router: Router = new Router();

    router.post(
      "/query/:role",
      bodyParser(),
      //  Auth.isAuthenticated(),
      middleware.roleExists,
      async (ctx: Koa.Context) => {
        const query: FT.Query = ctx.request.body;

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
      "/mutate",
      //  Auth.isAuthenticated(),
      bodyParser(),
      async (ctx: Koa.Context) => {
        const profile: T.Profile = ctx.state.profile as T.Profile;
        const query: FT.Mutate = ctx.request.body;

        const { constraints } = ctx.state as {
          constraints: {
            data: T.QueryConstraint;
            mutate: T.MutateConstraint;
          };
        };

        ctx.body = await qs.mutateWithConstraint(query, constraints.mutate); //;
      }
    );
  }
}

export default CrudRoutes;
