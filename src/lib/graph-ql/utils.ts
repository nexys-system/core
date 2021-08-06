import * as T from "./type";
import * as GL from "graphql";

export const ddl = (ddlComplete: T.DdlInput[]): T.Ddl[] =>
  ddlComplete.map((entity) => {
    const fields: T.Field[] = entity.fields.map((f) => {
      return {
        name: f.name,
        type: f.type,
        options: f.options,
        optional: f.optional || false,
      };
    });

    const isUuid: boolean = entity.uuid || false;

    if (isUuid) {
      fields.unshift({ name: "uuid", type: "String" });
    } else {
      fields.unshift({ name: "id", type: "Int" });
    }

    return {
      name: entity.name,
      fields,
    };
  });

const toEnum = (
  entity: string,
  { name, options }: T.Field
): GL.GraphQLOutputType => {
  if (!options) {
    return GL.GraphQLInt;
  }

  const values: { [att: string]: { value: number } } = {};

  options.forEach((option) => {
    values[option.id] = { value: option.id };
  });

  return new GL.GraphQLEnumType({
    name: entity + name + "enum",
    values,
  });
};

const availableTypes = [
  "String",
  "Boolean",
  "Int",
  "Float",
  "LocalDateTime",
  "LocalDate",
  "BigDecimal",
];

export const isFieldType = (s: string): s is T.FieldType =>
  availableTypes.includes(s);

export const mapTypes = (
  _entity: string,
  { name, type }: T.Field,
  entityTypes: T.GLTypes = new Map()
): GL.GraphQLOutputType | undefined => {
  if (!isFieldType(type)) {
    const foreignEntity = entityTypes.get(type);

    if (!foreignEntity) {
      return undefined;
    }
    /*  return new GL.GraphQLObjectType({
        name: entity + "_" + name,
        fields: { uuid: { type: GL.GraphQLString } },
      });
  */

    return foreignEntity.objectType;
  }

  if (
    // (name === "id" && type === "Int") ||
    // id in graphql is a string
    (name === "uuid" || name === "id") &&
    type === "String"
  ) {
    return GL.GraphQLID;
  }

  if (type === "Int") {
    // return  toEnum(entity, t)

    return GL.GraphQLInt;
  }

  if (type === "Float" || type === "BigDecimal") {
    return GL.GraphQLFloat;
  }

  if (type === "Boolean") {
    return GL.GraphQLBoolean;
  }

  // date returns a string
  if (type === "LocalDate" || type === "LocalDateTime") {
    return GL.GraphQLString;
  }

  if (type === "String") {
    return GL.GraphQLString;
  }

  throw Error("could not map the type");
};

const mapTypes2 = ({ name, type }: T.Field): string => {
  if (!isFieldType(type)) {
    return type;
  }

  if (
    // (name === "id" && type === "Int") ||
    // id in graphql is a string
    (name === "uuid" || name === "id") &&
    type === "String"
  ) {
    return "ID";
  }

  if (type === "Int") {
    // return  toEnum(entity, t)

    return "Int";
  }

  if (type === "Float" || type === "BigDecimal") {
    return "Float";
  }

  if (type === "Boolean") {
    return "Boolean";
  }

  // date returns a string
  if (type === "LocalDate" || type === "LocalDateTime") {
    return "String";
  }

  if (type === "String") {
    return "String";
  }

  throw Error("could not map the type");
};

// not used
const getSchemaFromDDL = (def: T.Ddl[]) => {
  const schemaArray = def.map((entity) => {
    const fields = entity.fields.map((f) => {
      return `  ${f.name}: ${mapTypes2(f)}${f.optional === true ? "" : "!"}`;
    });
    return `type ${entity.name} {\n${fields.join("\n")}\n}`;
  });

  return schemaArray.join("\n\n");
};

const foreignUuid = new GL.GraphQLObjectType({
  name: "ForeignUuid",
  fields: { uuid: { type: GL.GraphQLID } },
});
