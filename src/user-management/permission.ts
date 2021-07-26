import { Uuid } from "@nexys/utils/dist/types";
import { QueryService } from "./type";
import * as U from "./utils";
import { UOptionSet } from "@nexys/utils/dist/types";
//import * as QT from "../../query/types";
import * as CT from "./crud-type";

interface Params {}

export default class Permission {
  qs: QueryService;
  constructor(qs: QueryService) {
    this.qs = qs;
  }
  permissionNamesByUser = async (uuid: Uuid): Promise<string[]> => {
    const list = await this.listByUser(uuid);

    return list.map((x) => x.name);
  };

  listByUser = async (
    uuid: Uuid
  ): Promise<(UOptionSet & { userPermission: { uuid: Uuid } })[]> => {
    const r: {
      uuid: Uuid;
      permissionInstance: { permission: { uuid: Uuid; name: string } };
    }[] = await this.qs.list(U.Entity.UserPermission, {
      projection: {
        permissionInstance: {
          permission: { uuid: true, name: true },
          uuid: true,
        },
      },
      filters: { user: { uuid } },
    });

    return r.map((x) => ({
      uuid: x.permissionInstance.permission.uuid,
      name: x.permissionInstance.permission.name,
      userPermission: { uuid: x.uuid },
    }));
  };

  listByUserAssigned = async (user: {
    uuid: Uuid;
    instance: { uuid: Uuid };
  }): Promise<(UOptionSet & { assigned?: Uuid })[]> => {
    const query: Params = {
      filters: { user },
      projection: {
        permissionInstance: { permission: { name: true, uuid: true } },
      },
    };

    const permissionList = await this.listByInstance(user.instance);

    const r: {
      permissionInstance: { permission: UOptionSet };
      uuid: Uuid;
    }[] = await this.qs.list(U.Entity.UserPermission, query);

    return permissionList.map((permission) => {
      const y: UOptionSet & { assigned?: Uuid } = {
        uuid: permission.uuid,
        name: permission.name,
      };

      const f = r.find(
        (x) => x.permissionInstance.permission.uuid === permission.uuid
      );
      if (f) {
        y.assigned = f.uuid;
      }

      return y;
    });
  };

  listByInstance = async (instance: {
    uuid: Uuid;
  }): Promise<(UOptionSet & { permissionInstance: { uuid: Uuid } })[]> => {
    const query: Params = {
      filters: { instance },
      projection: { permission: { name: true, uuid: true } },
    };

    /*if (names.length > 0) {
      query.filters.permission = { name: { $in: names } };
    }*/

    const r = await this.qs.list(U.Entity.PermissionInstance, query);

    return r.map(
      (x: { permission: { uuid: string; name: string }; uuid: string }) => ({
        uuid: x.permission.uuid,
        name: x.permission.name,
        permissionInstance: { uuid: x.uuid },
      })
    );
  };

  listByInstanceAssigned = async (instance: {
    uuid: Uuid;
  }): Promise<(UOptionSet & { assigned?: Uuid })[]> => {
    const query: Params = {
      filters: { instance },
      projection: { permission: { name: true, uuid: true } },
    };

    /*if (names.length > 0) {
      query.filters.permission = { name: { $in: names } };
    }*/

    const permissionList = await this.list();

    const r: { permission: UOptionSet; uuid: Uuid }[] = await this.qs.list(
      U.Entity.PermissionInstance,
      query
    );

    return permissionList.map(
      (permission: { assigned?: string; uuid: string; name: string }) => {
        const y: UOptionSet & { assigned?: Uuid } = {
          uuid: permission.uuid,
          name: permission.name,
        };

        const f = r.find((x) => x.permission.uuid === permission.uuid);
        if (f) {
          y.assigned = f.uuid;
        }

        return y;
      }
    );
  };

  getByNames = async (
    instance: { uuid: Uuid },
    names: string[]
  ): Promise<(UOptionSet & { permissionInstance: { uuid: Uuid } })[]> => {
    if (names.length === 0) {
      throw Error(
        "you must indicate at least one permission. If what's expected is all permissions, user listbyInstance"
      );
    }

    const l = await this.listByInstance(instance);

    return l.filter((x) => names.includes(x.name));
  };

  /**
   *
   * @param uuids : these are permission uuids
   * @param user: user and uuid
   */
  assignToInstance = (uuids: Uuid[], instance: { uuid: Uuid }) => {
    const permissions = uuids.map((uuid) => ({
      instance,
      permission: { uuid },
    }));
    return this.qs.insertMultiple(U.Entity.PermissionInstance, permissions);
  };

  /**
   * inverse of above
   * @param uuids
   * @param user
   */
  revokeFromInstance = async (uuids: Uuid[], instance: { uuid: Uuid }) =>
    this.qs.delete(U.Entity.PermissionInstance, {
      permission: { uuid: { $in: uuids } },
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

    console.log(instance);

    console.log({
      filters: {
        permission: { uuid: permission.uuid },
        instance: { uuid: instance.uuid },
      },
    });

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
    names: string[],
    user: { uuid: Uuid; instance: { uuid: Uuid } }
  ) => {
    const permissions = await this.getByNames(user.instance, names);
    const permissionUuids: Uuid[] = permissions.map(
      (x) => x.permissionInstance.uuid
    );
    return this.assignToUser(permissionUuids, user);
  };

  // general permissions (no conditions, superadmin functionalities)

  list = async () => this.qs.list<CT.Permission>(U.Entity.Permission);

  detail = async (uuid: Uuid) =>
    this.qs.detail<CT.Permission>(U.Entity.Permission, uuid);

  insert = async (name: string) => {
    const row: Omit<CT.Permission, "uuid"> = { name };

    const r = await this.qs.insertUuid<CT.Permission>(U.Entity.Permission, row);

    return { uuid: r.uuid };
  };

  update = async (
    uuid: Uuid,
    name: string,
    description?: string
  ): Promise<boolean> => {
    const r = await this.qs.update<CT.Permission>(
      U.Entity.Permission,
      { uuid },
      { name, description }
    );

    return r.success;
  };

  delete = async (uuid: Uuid): Promise<boolean> => {
    const r = await this.qs.delete(U.Entity.Permission, { uuid });

    return r.success;
  };
}
