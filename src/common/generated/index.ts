const model = [
  {
    name: "Person",
    table: "person",
    uuid: true,
    fields: [
      {
        name: "firstName",
        column: "first_name",
        type: "String",
        optional: true,
      },
      { name: "lastName", column: "last_name", type: "String", optional: true },
      {
        name: "birthDate",
        column: "birth_date",
        type: "LocalDate",
        optional: true,
      },
      {
        name: "deathDate",
        column: "death_date",
        type: "LocalDate",
        optional: true,
      },
      { name: "sex", column: "sex", type: "Int", optional: true },
      {
        name: "birthLocation",
        column: "birth_location",
        type: "String",
        optional: true,
      },
    ],
  },
  {
    name: "PersonConnection",
    table: "person_connection",
    uuid: true,
    fields: [
      { name: "source", column: "source_id", type: "Person", optional: false },
      { name: "target", column: "target_id", type: "Person", optional: false },
      { name: "type", column: "type", type: "Int", optional: false },
    ],
  },
  {
    name: "User",
    table: undefined,
    uuid: true,
    fields: [
      {
        name: "firstName",
        column: "first_name",
        type: "String",
        optional: false,
      },
      {
        name: "lastName",
        column: "last_name",
        type: "String",
        optional: false,
      },
      { name: "email", column: "email", type: "String", optional: false },
      {
        name: "logDateAdded",
        column: "log_date_added",
        type: "LocalDateTime",
        optional: false,
      },
      {
        name: "instance",
        column: "instance_id",
        type: "Instance",
        optional: false,
      },
      {
        name: "localeLang",
        column: "locale_lang",
        type: "String",
        optional: true,
      },
      { name: "status", column: "status", type: "Int", optional: false },
      {
        name: "localeCountry",
        column: "locale_country",
        type: "String",
        optional: true,
      },
    ],
  },
  {
    name: "UserAuthentication",
    table: undefined,
    uuid: true,
    fields: [
      { name: "value", column: "value", type: "String", optional: false },
      {
        name: "isEnabled",
        column: "is_enabled",
        type: "Boolean",
        optional: false,
      },
      { name: "user", column: "user_id", type: "User", optional: false },
      { name: "type", column: "type", type: "Int", optional: false },
    ],
  },
  {
    name: "Instance",
    table: undefined,
    uuid: true,
    fields: [
      { name: "name", column: "name", type: "String", optional: false },
      {
        name: "logDateAdded",
        column: "log_date_added",
        type: "LocalDateTime",
        optional: false,
      },
    ],
  },
  {
    name: "UserPermission",
    table: undefined,
    uuid: true,
    fields: [
      {
        name: "permissionInstance",
        column: "permission_instance_id",
        type: "PermissionInstance",
        optional: false,
      },
      { name: "user", column: "user_id", type: "User", optional: false },
    ],
  },
  {
    name: "PermissionInstance",
    table: undefined,
    uuid: true,
    fields: [
      {
        name: "instance",
        column: "instance_id",
        type: "Instance",
        optional: false,
      },
      {
        name: "permission",
        column: "permission",
        type: "Int",
        optional: false,
      },
    ],
  },
  {
    name: "UserToken",
    table: undefined,
    uuid: true,
    fields: [
      { name: "user", column: "user_id", type: "User", optional: false },
      { name: "token", column: "token", type: "String", optional: false },
      {
        name: "logDateAdded",
        column: "log_date_added",
        type: "LocalDateTime",
        optional: false,
      },
      { name: "ip", column: "ip", type: "String", optional: true },
      {
        name: "userAgent",
        column: "user_agent",
        type: "String",
        optional: true,
      },
    ],
  },
];

export default model;
