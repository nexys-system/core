import * as CMS from "./cms";

import Utils from "@nexys/utils";

import { replaceParams } from "./utils";
import * as T from "./type";

const getSignature = async (
  params: { signature: any } | undefined,
  lang: any
) => {
  if (params && params.signature) {
    let { signature, ...rest } = params;
    signature = await get(signature, lang, rest);

    return {
      ...rest,
      signature: signature.content,
    };
  }

  return params;
};

const getCms = async (uuidOrKey: string): Promise<T.Core | T.LangValues> => {
  if (Utils.string.isUUID(uuidOrKey)) {
    return CMS.get(uuidOrKey);
  }

  return CMS.find(uuidOrKey);
};

/**
 * @oaram uuid: uuid of entry
 * @param lang: iso2 code of lang, e.g. "en", "fr", etc
 */
export const get = async (
  uuidOrKey: string,
  lang = "en",
  params?: any
): Promise<{ title: string; content: string; isHtml: boolean }> => {
  const cms = await getCms(uuidOrKey);
  const entry = (cms as any)[lang];

  if (entry) {
    let { title = "", content } = entry;
    if (!content) {
      throw Error("CMS content is undefined");
    }

    if (params) {
      params = await getSignature(params, lang);

      ({ title, content } = replaceParams(title, content, params));
    }

    return {
      title,
      content,
      isHtml: cms.isHtml as boolean,
    };
  } else {
    throw Error(`CMS entry not available for language ${lang}`);
  }
};
