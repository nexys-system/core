import Koa from "koa";

//import * as R from "../../common/generated/role";
import { Entity } from "../model/type";

import Constraints from "./index";
import { Permission } from "./type";

const mapRoleStringToPermission = (role: string): Permission => {
  switch (role) {
    case "app":
      return Permission.app;
    case "admin":
      return Permission.admin;
    case "superadmin":
      return Permission.superadmin;
  }

  throw Error("could not map role to a permission");
};

class MiddlewareConstraints extends Constraints {
  constructor(model: Entity[]) {
    super(model);
  }

  getRole = (role: string) => async (ctx: Koa.Context, next: Koa.Next) => {
    // map role to the enum Role
    //const rIdx: R.Role = R.roles.indexOf(role || "");

    try {
      const p = mapRoleStringToPermission(role);

      // make sure the useer is authenticated
      const { userCache, profile } = ctx.state;
      // and has the permission of value `role`

      const isUnauthorized: boolean =
        !userCache ||
        !userCache.permissions ||
        !Array.isArray(userCache.permissions); //|| !(check && userCache.permissions.includes(role))

      if (isUnauthorized) {
        ctx.body = { error: "unauthorized" };
        ctx.status = 401;
        return;
      }

      if (!profile) {
        throw Error("profile not defined");
      }

      // get the constraints associated with the role
      const constraints = this.byRole(profile).get(p);

      if (!constraints) {
        ctx.body = { error: "no constraints associated with this role" };
        ctx.status = 500;
        return;
      }

      // add constraints to the state so it can be used downstream
      ctx.state.constraints = constraints;

      await next();
    } catch (err) {
      console.log("get role", err);
      ctx.body = { error: "this role does not exist" };
      ctx.status = 404;
      return;
    }
  };

  roleExists = async (ctx: Koa.Context, next: Koa.Next) => {
    // extract role
    const { role }: { role?: string } = ctx.params;

    if (typeof role !== "string") {
      throw Error("role m,ust be a string");
    }

    await this.getRole(role)(ctx, next);
  };
}

export default MiddlewareConstraints;
