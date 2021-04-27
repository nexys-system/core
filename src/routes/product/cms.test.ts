import request from "supertest";
import Routes from "./index";
import Koa from "koa";

const myApp = new Koa();

myApp.use(Routes({} as any));

const app = myApp.listen();

describe("CMS Endpoints", () => {
  it("throw 400 error", async () => {
    const res = await request(app).post("/cms").send({});

    expect(res.status).toEqual(400);
    expect(JSON.parse(res.text)).toEqual({ uuid: ["This field is required"] });
  });
});

app.close();
