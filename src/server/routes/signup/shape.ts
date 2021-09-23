import { Type } from "@nexys/validation";

export const ShapeNotifications: Type.Shape = {
  uuid: { type: "string" },
  notifications: {
    $array: {
      type: "string",
    },
  },
};

export const ShapeProfile: Type.Shape = {
  firstName: { type: "string" },
  lastName: { type: "string" },
  email: { type: "string" },
};

export const ShapeBPNew: Type.Shape = {
  name: { type: "string" },
  countryCode: { type: "string" },
  isGoe: { type: "boolean", optional: true },
};

export const ShapeSignup: Type.Shape = {
  ceid: { type: "string", optional: true },
  countryCode: { type: "string" },
  profile: ShapeProfile,
  // businessPartnerNew: { ...ShapeBPNew, optional: true } // TODO!
  businessPartnerNew: {
    // name: { type: 'string' },
    type: "object",
    optional: true,
  },
  app: {
    type: "number",
  },
};

export const ShapeSignupIbm: Type.Shape = {
  ceid: { extraCheck: (v) => (v === "ibm" ? undefined : ["ceid must be ibm"]) },
  isIbm: { type: "boolean" },
  profile: ShapeProfile,
  app: {
    type: "number",
  },
};

export const ShapeSearch: Type.Shape = {
  searchString: { type: "string" },
  countryCode: { type: "string" },
};
