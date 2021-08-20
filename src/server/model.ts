import { Entity } from "../lib/query/model/type";

const model: Entity[] = [
  {
    name: "User",
    uuid: true,
    fields: [
      {
        name: "firstName",
        optional: false,

        type: "String",
      },
      {
        name: "lastName",
        optional: false,

        type: "String",
      },
      {
        name: "email",
        optional: false,

        type: "String",
      },
      {
        name: "logDateAdded",
        optional: false,

        type: "LocalDateTime",
      },
      {
        name: "instance",
        optional: false,

        type: "Instance",
      },
      {
        name: "localeLang",
        optional: true,

        type: "String",
      },
      {
        name: "status",
        optional: false,

        type: "Int",
        options: [
          {
            id: 1,
            name: "active",
          },
          {
            id: 2,
            name: "inactive",
          },
          {
            id: 3,
            name: "pending",
          },
        ],
      },
      {
        name: "localeCountry",
        optional: true,

        type: "String",
      },
    ],
  },
  {
    name: "UserAuthentication",
    uuid: true,
    fields: [
      {
        name: "value",
        optional: false,

        type: "String",
      },
      {
        name: "isEnabled",
        optional: false,

        type: "Boolean",
      },
      {
        name: "user",
        optional: false,

        type: "User",
      },
      {
        name: "type",
        optional: false,

        type: "Int",
        options: [
          {
            id: 1,
            name: "password",
          },
          {
            id: 7,
            name: "ibm",
          },
        ],
      },
    ],
  },
  {
    name: "Instance",
    uuid: true,
    fields: [
      {
        name: "name",
        optional: false,

        type: "String",
      },
      {
        name: "logDateAdded",
        optional: false,

        type: "LocalDateTime",
      },
    ],
  },
  {
    name: "UserPermission",
    uuid: true,
    fields: [
      {
        name: "permissionInstance",
        optional: false,

        type: "PermissionInstance",
      },
      {
        name: "user",
        optional: false,

        type: "User",
      },
    ],
  },
  {
    name: "PermissionInstance",
    uuid: true,
    fields: [
      {
        name: "instance",
        optional: false,

        type: "Instance",
      },
      {
        name: "permission",
        optional: false,

        type: "Int",
        options: [
          {
            id: 1,
            name: "app",
          },
          {
            id: 2,
            name: "admin",
          },
          {
            id: 3,
            name: "superadmin",
          },
        ],
      },
    ],
  },
  {
    name: "UserToken",
    uuid: true,
    fields: [
      {
        name: "user",
        optional: false,

        type: "User",
      },
      {
        name: "token",
        optional: false,

        type: "String",
      },
      {
        name: "logDateAdded",
        optional: false,

        type: "LocalDateTime",
      },
      {
        name: "ip",
        optional: true,

        type: "String",
      },
      {
        name: "userAgent",
        optional: true,

        type: "String",
      },
    ],
  },
  {
    name: "Company",
    uuid: false,
    fields: [
      {
        name: "name",
        optional: false,

        type: "String",
      },
      {
        name: "country",
        optional: false,

        type: "Country",
      },
      {
        name: "ceid",
        optional: true,

        type: "String",
      },
      {
        name: "wwid",
        optional: true,

        type: "String",
      },
      {
        name: "isObserved",
        optional: false,

        type: "Boolean",
      },
      {
        name: "tssFriendly",
        optional: false,

        type: "Boolean",
      },
      {
        name: "targetedId",
        optional: false,

        type: "Int",
      },
    ],
  },

  {
    name: "Country",
    uuid: false,
    fields: [
      {
        name: "name",
        optional: false,

        type: "String",
      },
      {
        name: "iso3166Alpha2",
        optional: false,

        type: "String",
      },
      {
        name: "iso3166Alpha3",
        optional: false,

        type: "String",
      },
      {
        name: "market",
        optional: false,

        type: "Market",
      },
    ],
  },
  {
    name: "Market",
    uuid: false,
    fields: [
      {
        name: "name",
        optional: false,

        type: "String",
      },
      {
        name: "geo",
        optional: false,

        type: "Geo",
      },
    ],
  },
  {
    name: "Geo",
    uuid: false,
    fields: [
      {
        name: "name",
        optional: false,

        type: "String",
      },
      {
        name: "short",
        optional: false,

        type: "String",
      },
    ],
  },
  {
    name: "Domain",
    uuid: true,
    fields: [
      {
        name: "name",
        optional: false,
        type: "String",
      },
      {
        name: "company",
        optional: false,
        type: "Company",
      },
    ],
  },
  {
    name: "Address",
    uuid: true,
    fields: [
      {
        name: "street",
        optional: false,
        type: "String",
      },
      {
        name: "street2",
        optional: true,
        type: "String",
      },
      {
        name: "street3",
        optional: true,
        type: "String",
      },
      {
        name: "zip",
        optional: false,
        type: "String",
      },
      {
        name: "city",
        optional: false,
        type: "String",
      },
      {
        name: "country",
        optional: false,
        type: "Country",
      },
      {
        name: "company",
        optional: false,
        type: "Company",
      },
    ],
  },
];

const companyUnit = model.find((x) => x.name === "Company");

if (!companyUnit) {
  throw Error("cannot find company entity");
}

const bpUnit = {
  ...companyUnit,
  uuid: false,
  name: "BusinessPartner",
  table: "company",
};
model.push(bpUnit);

export default model;
