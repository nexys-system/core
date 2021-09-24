import Utils from "@nexys/utils";
import * as T from "./type";
/**
 * takes a title and content (of cms / email) and replaces params with values
 */
export const replaceParams = (
  title: string,
  content: string,
  params: { [k: string]: string } = {}
) => {
  const paramArr = Utils.ds.linearize(params);
  paramArr.forEach(({ key, value }) => {
    const regex = new RegExp(`\\$\\{${key}\\}`, "g"); // TODO: make case insensitive?
    title = title ? title.replace(regex, value) : title;
    content = content ? content.replace(regex, value) : content;
  });

  return {
    title,
    content,
  };
};

export const formatValues = (
  data: { title: string; name: string; language: { iso2: string } }[]
): T.LangValues => {
  const values: { [lang: string]: { title: string; content: string } } = {};

  data.forEach(({ title, name, language }) => {
    values[language.iso2] = { title, content: name };
  });

  return values;
};
