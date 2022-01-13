import dotenv from "dotenv";
import fetch from "node-fetch";
import readline from "readline";
import fs, { promises as fsp } from "fs";
import * as U from "./utils";
import * as C from "./config";

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// get app_token from env var
const appToken = process.env["APP_TOKEN"];

if (typeof appToken === undefined) {
  throw Error("app token could not be found, check your .env file");
}

const url = C.host + C.pathAssets + appToken;

const init = async () => {
  // get last version of the type definition

  const r = await fetch(url, { method: "GET" });
  if (r.status !== 200) {
    throw Error(await r.text());
  }

  const { version, model, types, submodels } = (await r.json()) as any;

  if (!model) {
    throw Error("model is undefined");
  }

  console.log(
    `Version ${version} was fetched. It contains ${model.length} entities`
  );

  rl.question(
    `Would you like to create the file in "${C.outFolder}"? [y/n] `,
    async (answer) => {
      if (answer !== "y") {
        throw Error("process aborted, answer: " + answer);
      }

      // create dir (if not exist)
      await fsp.mkdir(C.outFolder, { recursive: true });

      const pathAndContents = [
        ["/index.ts", U.createModelTs(model)],
        ["/type.ts", types],
        ["/entities.ts", U.createEntities(model)],
      ];

      if (submodels && submodels !== "") {
        pathAndContents.push(["/submodels.ts", submodels]);
      }

      pathAndContents.forEach(([filepath, content]) => {
        const outFilepath = C.outFolder + filepath;
        console.log("- writing to file: " + outFilepath);
        fs.writeFileSync(outFilepath, content, "utf-8");
      });

      rl.close();
    }
  );
};

init();
