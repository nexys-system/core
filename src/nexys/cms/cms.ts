import * as NexysQueryService from "../nexys";
import { Query } from "@nexys/lib";

import { formatValues } from "./utils";
import * as T from "./type";
import { QueryParams } from "@nexys/fetchr/dist/type";

const entity = "i18nKey";

export const find = async (key: string): Promise<T.Core | T.LangValues> => {
  const params: QueryParams = {
    filters: { key },
    references: {
      i18nValue: {
        filters: {
          logIsLog: false,
        },
        projection: {
          language: {},
        },
      },
    },
  };

  const result = await NexysQueryService.find<any>(entity, params);
  const { uuid, isHtml } = result;

  const values = formatValues(result.i18nValue);

  return {
    uuid,
    key,
    isHtml,
    ...values,
  };
};

export const get = async (uuid: string): Promise<T.Core | T.LangValues> => {
  const references = {
    i18nValue: {
      filters: {
        logIsLog: false,
      },
      projection: {
        language: {},
      },
    },
  };

  const result = await NexysQueryService.detail<any>(
    entity,
    uuid,
    { isCms: true, isHtml: true },
    references
  );

  const { key, isHtml }: { key: string; isHtml: boolean } = result;

  const values: T.LangValues = formatValues(result.i18nValue);

  return {
    uuid,
    key,
    isHtml,
    ...values,
  };
};
