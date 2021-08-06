import * as T from "./type";
import * as GL from "graphql";

export const ddl = (ddlComplete: T.Ddl[]): T.Ddl[] =>
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
      uuid: entity.uuid || false,
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

export const mapInputType = (
  { name, type }: T.Field,
  def: T.Ddl[]
): GL.GraphQLInputType => {
  // if the field is not a standard field (i.e foreign key)
  // allow the user to filter by id/uuid
  if (!isFieldType(type)) {
    const entity = def.find((e) => e.name === type);

    if (entity) {
      if (entity.uuid) {
        return foreignUuid;
      } else {
        return foreignId;
      }
    }

    throw Error("map inputtype: entity could not be found");
  }

  return mapScalarType(type, name);
};

export const mapOutputType = (
  _entity: string,
  { name, type }: T.Field,
  entityTypes: T.GLTypes = new Map()
): GL.GraphQLOutputType | undefined => {
  if (!isFieldType(type)) {
    const foreignEntity = entityTypes.get(type);

    if (!foreignEntity) {
      return undefined;
    }

    return foreignEntity.objectType;
  }

  return mapScalarType(type, name);
};

const mapScalarType = (
  type: T.FieldType,
  name?: string
): GL.GraphQLScalarType => {
  if (
    // (name === "id" && type === "Int") ||
    // id in graphql is a string
    name &&
    (name === "uuid" || name === "id") &&
    type === "String"
  ) {
    return GL.GraphQLID;
  }

  switch (type) {
    case "Int":
      // to consider (not practial becaues returns a string
      // return  toEnum(entity, t)
      return GL.GraphQLInt;
    case "Float":
    case "BigDecimal":
      return GL.GraphQLFloat;
    case "Boolean":
      return GL.GraphQLBoolean;
    case "LocalDate":
    case "LocalDateTime":
      return GL.GraphQLString; // date returns a string
    case "String":
      return GL.GraphQLString;
  }
};

// not used
const mapTypesString = ({ name, type }: T.Field): string => {
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
      return `  ${f.name}: ${mapTypesString(f)}${
        f.optional === true ? "" : "!"
      }`;
    });
    return `type ${entity.name} {\n${fields.join("\n")}\n}`;
  });

  return schemaArray.join("\n\n");
};

export const foreignUuid = new GL.GraphQLInputObjectType({
  name: "ForeignUuid",
  fields: { uuid: { type: GL.GraphQLID } },
});

/*new GL.GraphQLObjectType({
  name: "ForeignUuid",
  fields: { uuid: { type: GL.GraphQLID } },
});*/

export const foreignId = new GL.GraphQLInputObjectType({
  name: "ForeignId",
  fields: { id: { type: GL.GraphQLInt } },
});
