import { Entity } from "../lib/query/model/type";

const model: Entity[] = [
  {
    name: "Instance",
    uuid: true,
    fields: [{ name: "name", type: "String", optional: false }],
  },
  {
    name: "User",
    uuid: true,
    fields: [
      { name: "instance", type: "Instance", optional: false },
      { name: "name", type: "String", optional: false },
      { name: "firstName", type: "String", optional: false },
      { name: "school", type: "School", optional: false },
    ],
  },
  {
    name: "School",
    uuid: true,
    fields: [{ name: "name", type: "String", optional: true }],
  },
];

export default model;
