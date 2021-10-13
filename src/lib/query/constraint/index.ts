import { Entity } from "../model/type";

//import {
//roleKeys,
//constraintsProjection,
//} from "../../../common/generated/role";
import { Profile, Constraint } from "./type";
import { Permission } from "../../user-management/crud-type";
import DefaultConstraints from "./default-constraints";

const roleKeys = [Permission.app, Permission.admin, Permission.superadmin];

class ConstraintGenerator extends DefaultConstraints {
  constructor(model: Entity[]) {
    super(model);
  }

  getConstraintByRole = (r: Permission, profile: Profile): Constraint => {
    if (r === Permission.admin) {
      return this.getAdmin(profile);
    }

    if (r === Permission.superadmin) {
      return this.getSuperadmin(profile);
    }

    if (r === Permission.app) {
      return this.getApp(profile);
    }

    throw Error("todo - only standard roles are accepted for now");

    /*const projectionConstraints = constraintsProjection.get(r) || [];
  
    const data: L.Query.Type.QueryConstraint = {
      filterConstraintsMap: new Map([]),
      projectionConstraintsMap: new Map(projectionConstraints)
    };
  
    const mutate: L.Query.Type.MutateConstraint = {
      filterConstraintsMap: new Map(),
      dataConstraintsMap: new Map(),
      append: { instance: { uuid: process.env.instanceUuid } }
    };
    return { data, mutate };*/
  };

  // todo
  //export const constraintsByRole = (profile: Profile) =>
  // new Map(roleKeys.map((r) => [r, getConstraintByRole(r, profile)]));

  byRole = (profile: Profile): Map<Permission, Constraint> =>
    new Map(roleKeys.map((r) => [r, this.getConstraintByRole(r, profile)]));
}

export default ConstraintGenerator;
