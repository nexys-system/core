import CMSService from "./index";
import nock from "nock";

const host = "http://myhost.com";
const CMS = new CMSService(host, "token");
const uuid = "myuuid";

const cms1 = {
  title: null,
  content:
    '<div class="container">\n\t\t<div class="text-center">\n\t\t\t<h1 style="color: white;">Badges TSS Academy</h1>\n\t\t\t<p>Les badges de la TSS Academy sont des badges que vous pouvez gagner en complétant le parcours d\'apprentissage commencé dans la TSS Academy</p>\n\t\t\t</div></div>',
  isHtml: false,
};

describe("CMS", () => {
  test("get entry", async () => {
    const body = { uuid, lang: "en" };
    nock(host)
      .post("/cms", body as nock.DataMatcherMap)
      .reply(200, cms1);

    const c = await CMS.get(uuid);

    expect(c).toEqual(cms1);
  });
});
