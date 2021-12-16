import fetch from "node-fetch";
import fs from "fs";
import readline from "readline";
import * as C from "./config";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const token = process.argv[2];
const outFile = process.argv[3] || ".env";

if (!token) {
  throw Error("token was not given");
}

const url = C.host + C.pathEnvVar + token;

interface EnvVar {
  key: string;
  value: string;
}

const envVarJsonToText = (e: EnvVar[]): string =>
  e.map(({ key, value }) => `${key}=${value}`).join("\n");

const init = async () => {
  const r = await fetch(url, { method: "GET" });
  const j: EnvVar[] = await r.json();

  const out = envVarJsonToText(j);

  console.log("=".repeat(50));
  console.log(out);
  console.log("=".repeat(50));

  rl.question(
    `The env variables (shown above) are about to be saved to "${outFile}", do you confirm? [y/n] `,
    (answer) => {
      if (answer !== "y") {
        throw Error("process aborted, answer: " + answer);
      }
      console.log("writing to file");
      fs.writeFileSync(outFile, out, "utf-8");
      rl.close();
    }
  );
};

init();
