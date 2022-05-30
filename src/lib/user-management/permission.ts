import { QueryParams } from "@nexys/fetchr/dist/type";

import QueryService from "../query/abstract-service";
import * as U from "./utils";
import * as CT from "./crud-type";

type Uuid = string;

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
      permissionInstance: { uuid: Uuid };
      uuid: Uuid;
      user: { uuid: Uuid };
    }[] = await this.qs.list(U.Entity.UserPermission, query);

    return permissionList.map((permission) => {
      const y: { permission: P; assigned?: Uuid } = {
        permission: permission.permission,
      };

      const f = r.find(
        (x) => x.permissionInstance.uuid === permission.permissionInstance.uuid
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
      projection: { permission: true },
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
  assignToInstance = async (
    permissionIdxs: CT.Permission[],
    instance: { uuid: Uuid }
  ): Promise<string[]> => {
    if (permissionIdxs.length === 0) {
      console.warn("tried to insert many permissions, but none were given");
      return [];
    }

    const permissions: Omit<CT.PermissionInstance, "uuid">[] =
      permissionIdxs.map((permission) => ({
        instance,
        permission,
        // logDateAdded: new Date(),
      }));

    const pIds = await this.qs.insertMultiple<CT.PermissionInstance>(
      U.Entity.PermissionInstance,
      permissions
    );

    return pIds.map((p) => p.uuid || "");
  };

  /**
   * inverse of above
   * @param uuids
   * @param user
   */
  revokeFromInstance = async (
    permissionIdxs: CT.Permission[],
    instance: { uuid: Uuid }
  ) =>
    this.qs.delete(U.Entity.PermissionInstance, {
      permission: { $in: permissionIdxs },
      instance,
    });

  toggleFromInstance = async (
    permissionIdxs: CT.Permission[],
    instance: { uuid: Uuid }
  ) => {
    // fetch existing (?) permissions
    const ls = await this.qs.list(U.Entity.PermissionInstance, {
      projection: { uuid: true },
      filters: { instance, permission: { $in: permissionIdxs } },
    });

    if (ls.length > 0) {
      return this.revokeFromInstance(permissionIdxs, instance);
    }

    return this.assignToInstance(permissionIdxs, instance);
  };

  /**
   *
   * @param uuids : these are "instance permission" uuids
   * @param user: user and uuid
   */
  assignToUser = (
    uuids: Uuid[],
    user: { uuid: Uuid } //; instance: { uuid: Uuid } } todo for admin permission
  ) => {
    const permissions: Omit<CT.UserPermission, "uuid">[] = uuids.map(
      (uuid) => ({
        user,
        permissionInstance: { uuid },
      })
    );
    return this.qs.insertMultiple<CT.UserPermission>(
      U.Entity.UserPermission,
      permissions
    );
  };

  assignToUser2 = async (permission: CT.Permission, user: { uuid: Uuid }) => {
    const permissionInstance = await this.permissionInstanceFromUser(
      permission,
      user
    );

    return this.assignToUserFromPermissionInstance(permissionInstance, user);
  };

  permissionInstanceFromUser = async (
    permission: CT.Permission,
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

  assignToUserFromPermissionInstance = async (
    permissionInstance: { uuid: Uuid },
    user: { uuid: Uuid }
  ): Promise<{ uuid: string }> => {
    const permission: Omit<CT.UserPermission, "uuid"> = {
      user,
      permissionInstance: { uuid: permissionInstance.uuid },
    };

    return this.qs.insertUuid<CT.UserPermission>(
      U.Entity.UserPermission,
      permission
    );
  };

  /**
   * inverse of above
   * @param uuids
   * @param user
   */
  revokeFromUser = async (
    permission: CT.Permission,
    user: { uuid: Uuid } //; instance: { uuid: Uuid } }  todo for admin permission
  ) => {
    const permissionInstance = await this.permissionInstanceFromUser(
      permission,
      user
    );

    return this.revokePermissionInstanceFromUser(
      { uuid: permissionInstance.uuid },
      user
    );
  };

  revokePermissionInstanceFromUser = async (
    permissionInstance: { uuid: Uuid },
    user: { uuid: Uuid }
  ) =>
    this.qs.delete(U.Entity.UserPermission, {
      permissionInstance: { uuid: permissionInstance.uuid },
      user,
    });

  listPermissionUser = async (
    permissionInstance: { uuid: Uuid },
    user: { uuid: Uuid }
  ): Promise<Pick<CT.UserPermission, "uuid">[]> =>
    this.qs.list(U.Entity.UserPermission, {
      projection: { uuid: true },
      filters: {
        permissionInstance: { uuid: permissionInstance.uuid },
        user,
      },
    });

  toggleFromUser = async (permission: CT.Permission, user: { uuid: Uuid }) => {
    try {
      // 1. get the permission instance record
      const permissionInstance = await this.permissionInstanceFromUser(
        permission,
        user
      );

      // 2. get the permission user record, if exists
      const ls = await this.listPermissionUser(permissionInstance, user);

      // 3.1 if some records found, delete
      if (ls.length > 0) {
        return this.revokePermissionInstanceFromUser(
          { uuid: permissionInstance.uuid },
          user
        );
        // 3.2 else create new
      } else {
        return this.assignToUserFromPermissionInstance(
          { uuid: permissionInstance.uuid },
          user
        );
      }
    } catch (err) {
      throw err;
    }
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
