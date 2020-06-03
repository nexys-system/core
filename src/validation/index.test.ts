import Joi from "@hapi/joi";
import HTTP from "@nexys/http";
import * as Validate from "./index";

test("get message", () => {
  expect(Validate.getMessage({ message: "m", type: "t" })).toEqual("t");
  expect(
    Validate.getMessage({ message: '"m', type: "object.missing" })
  ).toEqual("m");
});

test("formatErrors", () => {
  const fullErrors = {
    isJoi: true,
    name: "ValidationError",
    details: [
      {
        message: '"filter" is not allowed',
        path: ["PlanParticipant", "filter"],
        type: "object.allowUnknown",
        context: {
          child: "filter",
          value: { plan: { id: 45 } },
          key: "filter",
          label: "filter",
        },
      },
      {
        message: '"projections" is not allowed',
        path: ["Partner", "projections"],
        type: "object.allowUnknown",
        context: {
          child: "projections",
          value: {},
          key: "projections",
          label: "projections",
        },
      },
    ],
    _object: {},
  };

  const errors = fullErrors.details;

  const e = Validate.formatErrors(errors);
  const r = {
    "PlanParticipant.filter": ["object.allowUnknown"],
    "Partner.projections": ["object.allowUnknown"],
  };

  expect(e).toEqual(r);
});

test("formatErrors - empty", () => {
  expect(Validate.formatErrors()).toEqual({});
});

test("ensure Joi schema", () => {
  const plainSchema = {
    uuid: Joi.string().guid().required(),
    params: Joi.object().optional(),
    data: Joi.any().optional(),
  };

  expect(Joi.isSchema(plainSchema)).toBe(false);
  expect(Joi.isSchema(Validate.ensureSchema(plainSchema))).toBe(true);
});

describe("validate", () => {
  const name = Joi.string().alphanum().min(3).max(30).required();
  const schema = { name };
  const joiSchema = Joi.object({ name });

  const body = { name: "saliou" };

  test("success", async () => {
    const result = await Validate.validate(body, schema);
    expect(result).toEqual(body);

    expect("error" in result).toBe(false);
  });

  test("joi object success", async () => {
    const result = await Validate.validate(body, joiSchema);
    expect(result).toEqual(body);
  });

  test("async - success", async () => {
    const body = { name: "saliou" };

    const result = await Validate.validate(body, schema);
    expect(result).toEqual(body);

    expect("error" in result).toBe(false);
  });

  test("async - joi object", async () => {
    const body = { uuid: "test" };

    try {
      const v = await Validate.validate(
        body,
        Joi.object({
          uuid: Joi.string().guid(),
        })
      );
    } catch (err) {
      const e = new HTTP.Error({ uuid: ["string.guid"] });
      expect(err).toEqual(e);
    }
  });

  test("format errors", async () => {
    const body = { namse: "" };

    try {
      await Validate.validate(body, schema);
    } catch (err) {
      expect(err.status).toBe(400);
      // expect(v.detail[0].message).toEqual('"name" is required');
      expect(err.body).toEqual({ name: ["any.required"] });
    }
  });

  test("format errors 2", async () => {
    const body = { name: "sa" };

    try {
      await Validate.validate(body, schema);
    } catch (err) {
      expect(err.status).toBe(400);
      // expect(v.detail[0].message).toEqual('"name" length must be at least 3 characters long');
      expect(err.body).toEqual({ name: ["string.min"] });
    }
  });

  test("format errors with prefix", async () => {
    const body = { name: "sa" };

    try {
      await Validate.validate(body, schema, { format: { prefix: "params" } });
    } catch (err) {
      expect(err.status).toBe(400);
      // expect(v.detail[0].message).toEqual('"name" length must be at least 3 characters long');
      expect(err.body).toEqual({ "params.name": ["string.min"] });
    }
  });
});
