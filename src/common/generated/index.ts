const model = [
  {
    name: "Geo",
    uuid: false,
    fields: [
      { name: "name", column: "name", type: "String", optional: false },
      { name: "short", column: "short", type: "String", optional: false },
    ],
  },
  {
    name: "Company",
    uuid: false,
    fields: [
      { name: "name", column: "name", type: "String", optional: false },
      {
        name: "country",
        column: "country_id",
        type: "Country",
        optional: false,
      },
      {
        name: "companyType",
        column: "company_type_id",
        type: "CompanyType",
        optional: false,
      },
      { name: "ceid", column: "ceid", type: "String", optional: false },
      { name: "wwid", column: "wwid", type: "String", optional: true },
    ],
  },
  {
    name: "UserPermission",
    table: "user_permission",
    uuid: true,
    fields: [
      { name: "user", column: "user_id", type: "User", optional: false },
      {
        name: "permissionInstance",
        column: "permission_instance_id",
        type: "PermissionInstance",
        optional: false,
      },
    ],
  },
  {
    name: "UserStatus",
    uuid: false,
    fields: [{ name: "name", column: "name", type: "String", optional: false }],
  },
  {
    name: "Country",
    uuid: false,
    fields: [
      { name: "name", column: "name", type: "String", optional: false },
      {
        name: "isoAlpha2",
        column: "iso_alpha_2",
        type: "String",
        optional: false,
      },
      { name: "market", column: "market_id", type: "Market", optional: false },
    ],
  },
  {
    name: "PermissionPermissionGroup",
    table: "permission_permission_group",
    uuid: false,
    fields: [
      {
        name: "permissionGroup",
        column: "permission_group_id",
        type: "PermissionGroup",
        optional: false,
      },
      {
        name: "permission",
        column: "permission_id",
        type: "Permission",
        optional: false,
      },
      {
        name: "logDateAdded",
        column: "log_date_added",
        type: "LocalDateTime",
        optional: false,
      },
      { name: "logUser", column: "log_user_id", type: "User", optional: true },
    ],
  },
  {
    name: "Permission",
    table: "permission",
    uuid: false,
    fields: [
      { name: "name", column: "name", type: "String", optional: false },
      {
        name: "description",
        column: "description",
        type: "String",
        optional: true,
      },
      {
        name: "logDateAdded",
        column: "log_date_added",
        type: "LocalDateTime",
        optional: false,
      },
      { name: "logUser", column: "log_user_id", type: "User", optional: true },
    ],
  },
  {
    name: "Section",
    uuid: true,
    fields: [
      { name: "name", column: "name", type: "String", optional: false },
      {
        name: "description",
        column: "description",
        type: "String",
        optional: true,
      },
      { name: "page", column: "page_id", type: "Page", optional: false },
      { name: "status", column: "status_id", type: "Status", optional: false },
      { name: "content", column: "content", type: "String", optional: true },
      { name: "position", column: "position", type: "Int", optional: false },
    ],
  },
  {
    name: "Market",
    uuid: false,
    fields: [
      { name: "name", column: "name", type: "String", optional: false },
      { name: "geo", column: "geo_id", type: "Geo", optional: false },
    ],
  },
  {
    name: "Profile",
    uuid: false,
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
      {
        name: "company",
        column: "company_id",
        type: "Company",
        optional: false,
      },
    ],
  },
  {
    name: "File",
    uuid: true,
    fields: [
      {
        name: "section",
        column: "section_id",
        type: "Section",
        optional: true,
      },
      { name: "name", column: "name", type: "String", optional: false },
      {
        name: "contentType",
        column: "content_type",
        type: "String",
        optional: false,
      },
    ],
  },
  {
    name: "Page",
    uuid: true,
    fields: [
      { name: "name", column: "name", type: "String", optional: false },
      {
        name: "description",
        column: "description",
        type: "String",
        optional: true,
      },
      { name: "status", column: "status_id", type: "Status", optional: false },
      { name: "position", column: "position", type: "Int", optional: false },
    ],
  },
  {
    name: "PageCounter",
    uuid: false,
    fields: [
      { name: "page", column: "page_id", type: "Page", optional: false },
      { name: "user", column: "user_id", type: "User", optional: true },
      {
        name: "logDateAdded",
        column: "log_date_added",
        type: "LocalDateTime",
        optional: false,
      },
    ],
  },
  {
    name: "User",
    uuid: true,
    fields: [
      { name: "username", column: "username", type: "String", optional: true },
      { name: "email", column: "email", type: "String", optional: false },
      {
        name: "passwordBcrypt",
        column: "password_bcrypt",
        type: "String",
        optional: false,
      },
      { name: "secretKey", column: "keyy", type: "String", optional: false },

      { name: "language", column: "language_id", type: "Int", optional: false },
      {
        name: "logDateAdded",
        column: "date_added",
        type: "LocalDateTime",
        optional: false,
      },
      { name: "logUser", column: "log_user_id", type: "User", optional: true },
      {
        name: "redirectUrl",
        column: "redirect_url",
        type: "String",
        optional: true,
      },
      {
        name: "profile",
        column: "profile_id",
        type: "Profile",
        optional: true,
      },
      {
        name: "instance",
        column: "instance_id",
        type: "Instance",
        optional: false,
      },
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
      { name: "status", column: "status_id", type: "Int", optional: false },
      {
        name: "localeLang",
        column: "locale_lang",
        type: "String",
        optional: true,
      },
      {
        name: "localeCountry",
        column: "locale_country",
        type: "String",
        optional: true,
      },
      {
        name: "company",
        column: "company_id",
        type: "Company",
        optional: true,
      },
      { name: "faSecret", column: "fa_secret", optional: true, type: "String" },
    ],
  },
  {
    name: "PermissionGroup",
    table: "permission_group",
    uuid: false,
    fields: [
      { name: "name", column: "name", type: "String", optional: false },
      {
        name: "description",
        column: "description",
        type: "String",
        optional: true,
      },
      {
        name: "logDateAdded",
        column: "log_date_added",
        type: "LocalDateTime",
        optional: false,
      },
      { name: "logUser", column: "log_user_id", type: "User", optional: true },
    ],
  },
  {
    name: "CompanyType",
    uuid: false,
    fields: [{ name: "name", column: "name", type: "String", optional: false }],
  },
  {
    name: "Status",
    uuid: false,
    fields: [
      { name: "name", column: "name", type: "String", optional: false },
      {
        name: "description",
        column: "description",
        type: "String",
        optional: true,
      },
    ],
  },
  {
    name: "Instance",
    table: "instance",
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
    name: "PermissionInstance",
    table: "permission_instance",
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
        column: "permission_id",
        type: "Int",
        optional: false,
        optionSet: "Permission",
      },
    ],
  },
  {
    name: "UserAuthentication",
    table: "user_authentication",
    uuid: true,
    fields: [
      {
        name: "isEnabled",
        column: "is_enabled",
        type: "Boolean",
        optional: false,
      },
      { name: "type", column: "type_id", type: "Int", optional: false },
      { name: "user", column: "user_id", type: "User", optional: false },
      { name: "value", column: "value", type: "String", optional: false },
    ],
  },
  {
    name: "UserToken",
    uuid: true,
    fields: [
      { name: "ip", column: "ip", type: "String", optional: true },
      {
        name: "logDateAdded",
        column: "log_date_added",
        type: "LocalDateTime",
        optional: false,
      },
      { name: "token", column: "token", type: "String", optional: false },
      { name: "user", column: "user_id", type: "User", optional: false },
      {
        name: "userAgent",
        column: "user_agent",
        type: "String",
        optional: false,
      },
      {
        name: "status",
        column: "status",
        type: "Int",
        optional: false,
      },
      {
        name: "tokenType",
        column: "token_type",
        type: "Int",
        optional: false,
      },
    ],
  },
];

export default model;
