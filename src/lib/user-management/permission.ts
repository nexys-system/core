import { Uuid, UOptionSet } from "@nexys/utils/dist/types";
import { QueryParams } from "@nexys/fetchr/dist/type";

import { QueryService } from "./type";
import * as U from "./utils";
import * as CT from "./crud-type";

const allDefaultPermissions: CT.Permission[] = Object.keys(CT.Permission)
  .map((x) => Number(x))
  .filter((k) => !isNaN(k));

export default class Permission<P = CT.Permission> {
  qs: QueryService;
  list: P[];

  constructor(
    qs: QueryService,
    allPermissions: P[] = allDefaultPermissions as any
  ) {
    this.qs = qs;
    this.list = allPermissions;
  }

  permissionNamesByUser = async (uuid: Uuid): Promise<P[]> => {
    const list = await this.listByUser(uuid);

    return list.map((x) => x.permission);
  };

  listByUser = async (
    uuid: Uuid
  ): Promise<{ permission: P; userPermission: { uuid: Uuid } }[]> => {
    const r: {
      uuid: Uuid;
      permissionInstance: { permission: P };
    }[] = await this.qs.list(U.Entity.UserPermission, {
      projection: {
        permissionInstance: {
          permission: true,
          uuid: true,
        },
      },
      filters: { user: { uuid } },
    });

    return r.map((x) => ({
      permission: x.permissionInstance.permission,
      userPermission: { uuid: x.uuid },
    }));
  };

  listByUserAssigned = async (user: {
    uuid: Uuid;
    instance: { uuid: Uuid };
  }): Promise<{ permission: P; assigned?: Uuid }[]> => {
    const query: QueryParams = {
      filters: { user },
      projection: {
        permissionInstance: { permission: { name: true, uuid: true } },
      },
    };

    const permissionList = await this.listByInstance(user.instance);

    const r: {
      permissionInstance: { permission: P };
      uuid: Uuid;
    }[] = await this.qs.list(U.Entity.UserPermission, query);

    return permissionList.map((permission) => {
      const y: { permission: P; assigned?: Uuid } = {
        permission: permission.permission,
      };

      const f = r.find(
        (x) => x.permissionInstance.permission === permission.permission
      );

      if (f) {
        y.assigned = f.uuid;
      }

      return y;
    });
  };

  listByInstance = async (instance: {
    uuid: Uuid;
  }): Promise<{ permission: P; permissionInstance: { uuid: Uuid } }[]> => {
    const query: QueryParams = {
      filters: { instance },
      projection: { permission: { name: true, uuid: true } },
    };

    /*if (names.length > 0) {
      query.filters.permission = { name: { $in: names } };
    }*/

    const r = await this.qs.list(U.Entity.PermissionInstance, query);

    return r.map((x: { permission: P; uuid: string }) => ({
      permission: x.permission,
      permissionInstance: { uuid: x.uuid },
    }));
  };

  listByInstanceAssigned = async (instance: {
    uuid: Uuid;
  }): Promise<{ permission: P; assigned?: boolean }[]> => {
    const query: QueryParams = {
      filters: { instance },
      projection: { permission: true },
    };

    /*if (names.length > 0) {
      query.filters.permission = { name: { $in: names } };
    }*/

    const r: { permission: P; uuid: Uuid }[] = await this.qs.list(
      U.Entity.PermissionInstance,
      query
    );

    return this.list.map((permission) => {
      const f = r.find((x) => x.permission === permission);

      if (f) {
        return { permission, assigned: true };
      }

      return { permission };
    });
  };

  getByNames = async (
    instance: { uuid: Uuid },
    names: P[]
  ): Promise<{ permission: P; permissionInstance: { uuid: Uuid } }[]> => {
    if (names.length === 0) {
      throw Error(
        "you must indicate at least one permission. If what's expected is all permissions, user list by instance"
      );
    }

    const l = await this.listByInstance(instance);

    return l.filter((x) => names.includes(x.permission));
  };

  /**
   *
   * @param uuids : these are permission uuids
   * @param user: user and uuid
   */
  assignToInstance = (
    permissionIdxs: Permission[],
    instance: { uuid: Uuid }
  ) => {
    const permissions = permissionIdxs.map((permission) => ({
      instance,
      permission,
    }));

    return this.qs.insertMultiple(U.Entity.PermissionInstance, permissions);
  };

  /**
   * inverse of above
   * @param uuids
   * @param user
   */
  revokeFromInstance = async (
    permissionIdxs: Permission[],
    instance: { uuid: Uuid }
  ) =>
    this.qs.delete(U.Entity.PermissionInstance, {
      permission: { $in: permissionIdxs },
      instance,
    });

  /**
   *
   * @param uuids : these are "instance permission" uuids
   * @param user: user and uuid
   */
  assignToUser = (
    uuids: Uuid[],
    user: { uuid: Uuid } //; instance: { uuid: Uuid } } todo for admin permission
  ) => {
    const permissions = uuids.map((uuid) => ({
      user,
      permissionInstance: { uuid },
    }));
    return this.qs.insertMultiple(U.Entity.UserPermission, permissions);
  };

  permissionInstanceFromUser = async (
    permission: { uuid: Uuid },
    user: { uuid: Uuid }
  ) => {
    const { instance }: { instance: { uuid: Uuid } } =
      await this.qs.find<CT.User>(
        U.Entity.User,
        { projection: { instance: true }, filters: { uuid: user.uuid } },
        true
      );

    if (!instance) {
      throw Error("no instance found");
    }

    // get permissionInstance
    const permissionInstance = await this.qs.find<CT.PermissionInstance>(
      U.Entity.PermissionInstance,
      {
        filters: {
          permission,
          instance,
        },
      },
      true
    );

    if (!permissionInstance) {
      throw Error("no permission instance found");
    }

    return permissionInstance;
  };

  assignToUser2 = async (
    uuid: Uuid,
    user: { uuid: Uuid } //; instance: { uuid: Uuid } } todo for admin permission
  ) => {
    const permissionInstance = await this.permissionInstanceFromUser(
      { uuid },
      user
    );

    const permissions = {
      user,
      permissionInstance: { uuid: permissionInstance.uuid },
    };
    return this.qs.insert(U.Entity.UserPermission, permissions);
  };

  /**
   * inverse of above
   * @param uuids
   * @param user
   */
  revokeFromUser = async (
    uuid: Uuid,
    user: { uuid: Uuid } //; instance: { uuid: Uuid } }  todo for admin permission
  ) => {
    const permissionInstance = await this.permissionInstanceFromUser(
      { uuid },
      user
    );

    return this.qs.delete(U.Entity.UserPermission, {
      permissionInstance: { uuid: permissionInstance.uuid },
      user,
    });
  };

  assignToUserByNames = async (
    names: P[],
    user: { uuid: Uuid; instance: { uuid: Uuid } }
  ) => {
    const permissions = await this.getByNames(user.instance, names);
    const permissionUuids: Uuid[] = permissions.map(
      (x) => x.permissionInstance.uuid
    );
    return this.assignToUser(permissionUuids, user);
  };

  // general permissions (no conditions, superadmin functionalities)
}
