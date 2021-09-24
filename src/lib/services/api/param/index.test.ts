import { ParamType, RequestMapping } from "../types";
import * as ParamService from "./index";

/*
  TODO: test for all types

  const j = {
    'a': 1,
    'b': 2,
    'c' : {
      'c1': 11,
      'c2': 12,
      'c3': {
        'c31': 34,
        'c32': 'a string',
        'c33': [1, 2, 3, 4]
      }
    }
  };

  const r = [
    {key: "a", value: 1},
    {key: 'b', value: 2},
    {key: "c.c1", value: 11},
    {key: "c.c2", value: 12},
    {key: 'c.c3.c31', value: 34},
    {key: 'c.c3.c32', value: 'a string'},
    {key: 'c.c3.c33', value: [1, 2, 3, 4]}
  ];

  const j3 = {
    float: 0.1,
    int: 1,
    object: {array: [], int: 1},
    array: [{float:1}, 2],
    object_to_flatten: {array: [], int: 2}
  };

  const r3 = [
    {key: "float", value: 0.1},
    {key: 'int', value: 1},
    {key: "object_to_flatten.array", value: []},
    {key: "object_to_flatten.int", value: 2},
    {key: "object", value: {array: [], int: 1}},  // m3 specifies not to flatten
    {key: "array", value: [{float:1}, 2]},  // m3 specifies not to flatten
  ];
*/

// output of wht is saved in the model (list of api params)
const rawMapping = [
  {
    dataType: { id: 1 },
    isOptional: false,
    valueDefault: "Basic game:S9n3UuuWmYtetht9",
    inOrOut: true,
    paramDefault: {
      name: "Authorization",
      paramType: { id: 2 },
    },
  },
  {
    dataType: { id: 1 },
    isOptional: false,
    valueDefault: null,
    inOrOut: true,
    paramDefault: {
      name: "profile.firstName",
      paramType: { id: 1 },
    },
  },
  {
    dataType: { id: 1 },
    isOptional: false, // true
    inOrOut: true,
    paramDefault: {
      name: "profile.lastName",
      paramType: { id: 1 },
    },
  },
  {
    dataType: { id: 1 },
    isOptional: false,
    inOrOut: true,
    paramDefault: {
      name: "profile.email",
      paramType: { id: 1 },
    },
  },
  {
    dataType: { id: 2 },
    isOptional: false,
    inOrOut: true,
    paramDefault: {
      name: "profile.country.id",
      paramType: { id: 1 },
    },
  },
  {
    dataType: { id: 1 },
    isOptional: false,
    inOrOut: true,
    paramDefault: {
      name: "password.password1",
      paramType: { id: 1 },
    },
  },
  {
    dataType: { id: 1 },
    isOptional: false,
    inOrOut: true,
    paramDefault: {
      name: "password.password2",
      paramType: { id: 1 },
    },
  },
];

// make sure that mapping object is properly created
test("test param mapping", () => {
  const mapping = ParamService.createMapping(rawMapping as any, false);

  expect(mapping).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        mapping: expect.objectContaining({
          input: expect.anything(),
        }),
      }),
    ])
  );
});

// NOTE: make sure validation works
test("validate param schema", () => {
  const result = { error: undefined }; //Validation.validateSync(body, schema, { abortEarly: false });
  expect(result.error).toBe(undefined);
});

// TODO: validate param schema -> error
test("process input: default values", () => {
  const data = {}; // input data

  // mapping parameters
  const mapping: Omit<RequestMapping, "inOrOut" | "isOptional">[] = [
    {
      paramOverride: {
        name: "snippetUuid",
        paramType: { id: ParamType.body },
        //valueDefault: undefined,
      },
      paramDefault: {
        name: "uuid",
        paramType: { id: ParamType.body },
        //valueDefault: null, // should be 'asdf'?
      },
      valueDefault: "asdf",
      dataType: { id: 2 },
    },
  ];

  const params = ParamService.Input.listMerge({ data }, mapping);

  expect(params.length).toBe(2);
  expect(params[0].key).toEqual("snippetUuid");
  expect(params[0].value).toEqual("asdf");
  expect(params[1].key).toEqual("snippetUuid");
  expect(params[1].value).toEqual("asdf");
});

/*
  TODO: test for nested objects and arrays

  const m3 = [{
    "uuid": "d3946108-6766-11e9-8e3b-42010aac0008",
    "inOrOut": true,
    "paramOverride": {
      "name": "object",
      "paramType": 1,
      "valueDefault": null
    },
    "paramDefault": {
      "name": "params.object",
      "paramType": 1,
      "valueDefault": null
    },
    "dataType": 6,
    "isOptional": false,
    "valueDefault": null
  }, {
    "uuid": "c71ed655-6766-11e9-8e3b-42010aac0008",
    "inOrOut": true,
    "paramOverride": {
      "name": "array",
      "paramType": 1,
      "valueDefault": null
    },
    "paramDefault": {
      "name": "params.array",
      "paramType": 1,
      "valueDefault": null
    },
    "dataType": 5,
    "isOptional": false,
    "valueDefault": null
  }]

  test('map to apiparam (optional)', () => {
    const m = {paramDefault: {name: 'company.name', paramType: { id: 1 }}, isOptional: true};
    const values = [
      {key: 'company', value: 'myCompany', paramType: { id: 1 }}
    ];
    const inOrOut = false;
    const errors = {};
    const i = WorkflowUtil.mapToApiParam(m, values, inOrOut, errors);
    const o = null;

    const errorExpected = {};

    expect(i).toEqual(o);
    expect(errorExpected).toEqual(errors);
  });

  test('map to apiparam (default Value)', () => {
    const m = {paramDefault: {name: 'company.name', paramType: { id: 1 }}, isOptional: true, valueDefault: 'my default value'};
    const values = [
      {key: 'company', value: 'myCompany', paramType: { id: 1 }}
    ];
    const inOrOut = false;
    const errors = {};
    const i = WorkflowUtil.mapToApiParam(m, values, inOrOut, errors);
    const o = {paramType: { id: 1 }, key: 'company.name', value: 'my default value'};

    const errorExpected = {};

    expect(i).toEqual(o);
    expect(errorExpected).toEqual(errors);
  });
*/

// TODO: test mapParams isOptional

const params = [
  { key: "id", value: 98, paramType: { id: 1, name: "body" } },
  {
    key: "server",
    value: "nginx/1.15.0",
    paramType: { id: 2, name: "headers" },
  },
  {
    key: "date",
    value: "Fri, 02 Aug 2019 10:45:39 GMT",
    paramType: { id: 2, name: "headers" },
  },
  {
    key: "content-type",
    value: "application/json",
    paramType: { id: 2, name: "headers" },
  },
  { key: "content-length", value: "9", paramType: { id: 2, name: "headers" } },
  { key: "connection", value: "close", paramType: { id: 2, name: "headers" } },
];

const mappingOut = [
  {
    uuid: "424394b5-b20b-11e9-8e3b-42010aac0008",
    dataType: { id: 1 },
    isOptional: false,
    inOrOut: false,
    paramDefault: {
      name: "id",
      paramType: { id: 1, name: "body" },
    },
  },
];

// check the linearization of the response (body and header)
test("params out", () => {
  const response = {
    status: 200,
    body: { id: 98 },
    headers: {
      server: "nginx/1.15.0",
      date: "Fri, 02 Aug 2019 10:45:39 GMT",
      "content-type": "application/json",
      "content-length": "9",
      connection: "close",
    },
  };

  const { body, headers } = response;
  const paramsOut = ParamService.Output.listMerge(
    { body, headers },
    mappingOut
  );

  // TODO: test for HTTPSuccess.headers
  expect(paramsOut).toEqual(params);
});

/*
  test('map to apiparam out', () => {
    const m = {paramOverride: {'name': 'companyName', paramType: { id: 1 }}, paramDefault: {name: 'company.name', paramType: { id: 1 }}};
    const values = [
      {key: 'companyName', value: 'myCompany', paramType: { id: 1 }}
    ];
    const inOrOut = false;
    const errors = {};

    const i = WorkflowUtil.mapToApiParam(m, values, inOrOut, errors);

    const o = {
      key: 'company.name',
      paramType: { id: 1 },
      value: 'myCompany',
    };

    expect(i).toEqual(o);
  });
*/

test("map output", () => {
  // NOTE: no schema validation on way out
  const mappedOutput = ParamService.mapParams(mappingOut, [params[0]], false);
  const output = ParamService.Output.explodeList(mappedOutput);

  expect(output.body).toEqual({ id: 98 });
  expect(output.headers).toEqual({});
});

test("map output error", () => {
  const params = [{ key: "$array", value: [] }];

  try {
    ParamService.mapParams(mappingOut, params, false);
  } catch (err) {
    expect(err).toEqual(Error("No array mapping found"));
  }
});

test("map root array properties", () => {
  const arrayPropMapping = [
    {
      uuid: "88ada479-b472-11e9-8e3b-42010aac0008",
      dataType: { id: 1 },
      isOptional: false,
      inOrOut: false,
      paramDefault: {
        id: 519,
        name: "$array[name]",
        paramType: { id: 1 },
      },
    },
    {
      dataType: { id: 1 },
      isOptional: false,
      inOrOut: false,
      paramDefault: {
        id: 521,
        name: "$array[].aId",
        paramType: { id: 1 },
      },
      paramOverride: {
        id: 520,
        name: "bId",
        paramType: { id: 1 },
      },
    },
    {
      dataType: { id: 1 },
      isOptional: false,
      inOrOut: false,
      paramDefault: {
        name: "$array[].cid",
        paramType: { id: 1 },
      },
      paramOverride: {
        name: "dId",
        paramType: { id: 1 },
      },
    },
  ];

  const propValues = [
    {
      key: "$array",
      value: [
        {
          name: "ASDF",
          aId: "asdf1",
          cid: "asdf2",
        },
      ],
    },
  ];

  // NOTE: no schema validation on way out
  const mappedOutput = ParamService.mapParams(
    arrayPropMapping,
    propValues,
    false
  );
  const output = ParamService.Output.explodeList(mappedOutput);

  expect(output.body).toEqual([
    {
      name: "ASDF",
      bId: "asdf1",
      dId: "asdf2",
    },
  ]);

  expect(output.headers).toEqual({});
});

test("map root array first item", () => {
  const arrayFirstMapping = [
    {
      uuid: "88ada479-b472-11e9-8e3b-42010aac0008",
      dataType: { id: 1 },
      isOptional: false,
      inOrOut: false,
      paramDefault: {
        name: "$array[0]",
        paramType: { id: 1 },
      },
    },
  ];

  const firstValues = [
    {
      key: "$array",
      value: [
        {
          x: 1,
        },
        {
          y: 2,
        },
        {
          z: 3,
        },
      ],
    },
  ];

  // NOTE: no schema validation on way out
  const mappedOutput = ParamService.mapParams(
    arrayFirstMapping,
    firstValues,
    false
  );
  const output = ParamService.Output.explodeList(mappedOutput);

  expect(output.body).toEqual({ x: 1 });
  expect(output.headers).toEqual({});
});

test("map root array to property", () => {
  const arrayMapping = [
    {
      uuid: "88ada479-b472-11e9-8e3b-42010aac0008",
      dataType: { id: 1 },
      isOptional: false,
      inOrOut: false,
      paramDefault: {
        name: "$array[]",
        paramType: { id: 1 },
      },
      paramOverride: {
        name: "data",
        paramType: { id: 1 },
      },
    },
  ];

  const values = [
    {
      key: "$array",
      value: [
        {
          x: 1,
        },
        {
          y: 2,
        },
        {
          z: 3,
        },
      ],
    },
  ];

  // NOTE: no schema validation on way out
  const mappedOutput = ParamService.mapParams(arrayMapping, values, false);
  const output = ParamService.Output.explodeList(mappedOutput);

  expect(output.body).toEqual({ data: [{ x: 1 }, { y: 2 }, { z: 3 }] });
  expect(output.headers).toEqual({});
});
