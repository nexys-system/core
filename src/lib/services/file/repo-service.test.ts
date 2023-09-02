import Repo from "./repo-service";

import * as NexysService from "../nexys-service";

import nock from "nock";
import { Context } from "../../context/type";
const appToken = "mytoken";
const host = NexysService.host;

const context: Pick<Context, "appToken"> = { appToken };

const repoService = new Repo(context);

function toArrayBuffer(buffer: Buffer): ArrayBuffer {
  const arrayBuffer = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return arrayBuffer;
}

/*
test("write", async () => {
  nock(host)
    .post("/file/write")
    .matchHeader("content-type", "application/json")
    .matchHeader("app-token", appToken)
    .once()
    .reply(200, { status: true });

  const r = await repoService.write("filename.txt", "mydata");
  expect(r).toEqual({ status: true });
});*/

test("serve", async () => {
  const t = "hello world";
  const b = toArrayBuffer(Buffer.from(t));
  nock(host)
    .post("/file/serve")
    .matchHeader("content-type", "application/json")
    .matchHeader("app-token", appToken)
    .once()
    .reply(200, b);

  const r = await repoService.serve("myfilename.txt");
  expect(r).toEqual(b);
});

/*test("upload", async () => {
  nock(host)
    .post("/file/upload")
    .matchHeader("app-token", appToken)
    .once()
    .reply(200, { status: true });

  const r = await repoService.upload({
    file: {
      value: Buffer.from("hello world"),
      options: { filename: "myfile" },
    },
    name: "myfile",
  });
  expect(r).toEqual({ status: true });
});*/

/*
describe("real life example", () => {
  const host = "https://flow.nexys.io";
const token = 'xxx'
  const repoService = new Repo(host, token);

  test("write", async () => {
    const r2 = await repoService.write("gfd.txt", "myda");
    expect(r2).toEqual({ status: true });
  });

  test("service", async () => {
    const r = await repoService.serve("gfd.txt");
    expect(r.toString()).toEqual("myda");
  });

  test("upload", async () => {
    const r = await repoService.upload({
      name: "myfile.txt",
      file: {
        value: Buffer.from("hello world"),
        options: { filename: "f" },
      },
    });
    console.log(r);
    expect(r).toEqual({ status: true });
  });

  test("service", async () => {
    const r = await repoService.serve("myfile.txt");
    expect(r.toString()).toEqual("hello world");
  });
});*/
