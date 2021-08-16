interface Field {
  name: string;
  type: string;
  optional: boolean;
  options?: any[];
}

interface Entity {
  name: string;
  uuid: boolean;
  fields: Field[];
}

const model: Entity[] = [
  {
    name: "Investor",
    uuid: true,
    fields: [
      {
        name: "phone",
        optional: true,

        type: "String",
      },
      {
        name: "company",
        optional: true,

        type: "String",
      },
      {
        name: "iban",
        optional: true,

        type: "String",
      },
      {
        name: "bic",
        optional: true,

        type: "String",
      },
      {
        name: "user",
        optional: false,

        type: "User",
      },
    ],
  },
  {
    name: "Property",
    uuid: true,
    fields: [
      {
        name: "street",
        optional: false,

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
        name: "categoryId",
        optional: false,

        type: "Int",
        options: [
          {
            id: 1,
            name: "test",
          },
        ],
      },
      {
        name: "typeId",
        optional: false,

        type: "Int",
      },
      {
        name: "statusId",
        optional: false,

        type: "Int",
      },
      {
        name: "purchasePrice",
        optional: false,

        type: "BigDecimal",
      },
      {
        name: "sharePrice",
        optional: false,

        type: "BigDecimal",
      },
    ],
  },
  {
    name: "InvestorProperty",
    uuid: true,
    fields: [
      {
        name: "user",
        optional: false,

        type: "Investor",
      },
      {
        name: "property",
        optional: false,

        type: "Property",
      },
      {
        name: "n_shares",
        optional: false,

        type: "BigDecimal",
      },
    ],
  },
  {
    name: "Transaction",
    uuid: true,
    fields: [
      {
        name: "property",
        optional: false,

        type: "Property",
      },
      {
        name: "user",
        optional: false,

        type: "Investor",
      },
      {
        name: "amount",
        optional: false,

        type: "BigDecimal",
      },
      {
        name: "date",
        optional: false,

        type: "LocalDate",
      },
      {
        name: "typeId",
        optional: false,

        type: "Int",
      },
    ],
  },
  {
    name: "Referral",
    uuid: true,
    fields: [
      {
        name: "user",
        optional: false,

        type: "Investor",
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
        name: "statusId",
        optional: false,

        type: "Int",
      },
    ],
  },
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
            name: "ACTIVE",
          },
          {
            id: 2,
            name: "INACTIVE",
          },
          {
            id: 3,
            name: "PENDING",
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
    name: "UserStatus",
    uuid: false,
    fields: [
      {
        name: "name",
        optional: false,

        type: "String",
      },
    ],
  },
  {
    name: "Tenant",
    uuid: true,
    fields: [
      {
        name: "phone",
        optional: false,

        type: "String",
      },
      {
        name: "user",
        optional: false,

        type: "User",
      },
    ],
  },
  {
    name: "TenantProperty",
    uuid: true,
    fields: [
      {
        name: "rent",
        optional: false,

        type: "BigDecimal",
      },
      {
        name: "dateStart",
        optional: false,

        type: "LocalDate",
      },
      {
        name: "dateEnd",
        optional: true,

        type: "LocalDate",
      },
      {
        name: "property",
        optional: false,

        type: "Property",
      },
      {
        name: "tenant",
        optional: false,

        type: "Tenant",
      },
    ],
  },
  {
    name: "TenantRent",
    uuid: true,
    fields: [
      {
        name: "tenantProperty",
        optional: false,

        type: "TenantProperty",
      },
      {
        name: "statusId",
        optional: false,

        type: "Int",
        options: [
          {
            id: 1,
            name: "pending",
          },
          {
            id: 2,
            name: "paid",
          },
          {
            id: 3,
            name: "overdue",
          },
        ],
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
        name: "dateAdded",
        optional: false,

        type: "LocalDateTime",
      },
    ],
  },
  {
    name: "Permission",
    uuid: true,
    fields: [
      {
        name: "name",
        optional: false,

        type: "String",
      },
      {
        name: "description",
        optional: true,

        type: "String",
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

        type: "Permission",
      },
    ],
  },
  {
    name: "MaintenanceType",
    uuid: false,
    fields: [
      {
        name: "name",
        optional: false,

        type: "String",
      },
    ],
  },
  {
    name: "Maintenance",
    uuid: true,
    fields: [
      {
        name: "property",
        optional: false,

        type: "Property",
      },
      {
        name: "tenancy",
        optional: true,

        type: "TenantProperty",
      },
      {
        name: "subject",
        optional: false,

        type: "String",
      },
      {
        name: "type",
        optional: false,

        type: "MaintenanceType",
      },
      {
        name: "priorityId",
        optional: false,

        type: "Int",
        options: [
          {
            id: 1,
            name: "Low",
          },
          {
            id: 2,
            name: "Default",
          },
          {
            id: 3,
            name: "Emergency",
          },
        ],
      },
      {
        name: "description",
        optional: true,

        type: "String",
      },
      {
        name: "statusId",
        optional: false,

        type: "Int",
        options: [
          {
            id: 1,
            name: "ToDo",
          },
          {
            id: 2,
            name: "InProgress",
          },
          {
            id: 3,
            name: "Done",
          },
        ],
      },
    ],
  },
  {
    name: "Service",
    uuid: true,
    fields: [
      {
        name: "name",
        optional: false,

        type: "String",
      },
      {
        name: "date",
        optional: false,

        type: "String",
      },
    ],
  },
  {
    name: "UserToken",
    uuid: true,
    fields: [
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
        name: "user",
        optional: false,

        type: "User",
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
];

export default model;
