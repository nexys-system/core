import * as T from "./type";
import * as U from "./utils";
import * as TT from "../../lib/services/api/types";
import { QueryParams } from "@nexys/fetchr/dist/type";
import { Uuid } from "@nexys/utils/dist/types";

import * as NexysQueryService from "../nexys-qs";
import { Context } from "../../lib/context/type";

const getParams = (uuid: Uuid): QueryParams => ({
  filters: {
    instance: { uuid },
    logIsLog: false,
  },
  projection: {
    method: {},
  },
  references: {
    ParamMapping: {
      filters: {
        logIsLog: false,
      },
      projection: {
        input: {
          paramType: {},
        },
        output: {
          paramType: {},
        },
        dataType: {},
        logIsLog: false,
        logUser: false,
        logDateAdded: false,
        logPreviousVersionId: false,
      },
    },
  },
});

/**
 * Get API requests from CRUD
 **/
export const fetch = async (
  context: Pick<Context, "instance">
): Promise<TT.Request[]> => {
  const params = getParams(context.instance.uuid);

  try {
    const result: T.ApiRequest[] = await NexysQueryService.list(
      "Request",
      params
    );

    return result.map(U.format);
  } catch (err) {
    throw Error("Nexys Query for Request did not work / could not be reached");
  }
};
