import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../"
);

function getTsPkgs(subRoot) {
  return fs
    .readdirSync(path.join(root, subRoot))
    .filter(name => name.startsWith("babel-"))
    .map(name => ({
      name: name.replace(/^babel-/, "@babel/"),
      dir: path.resolve(root, subRoot, name),
      relative: `./${subRoot}/${name}`,
    }))
    .filter(({ dir }) => fs.existsSync(path.join(dir, "src", "index.ts")));
}

const tsPkgs = [
  ...getTsPkgs("packages"),
  ...getTsPkgs("eslint"),
  ...getTsPkgs("codemods"),
];

fs.writeFileSync(
  path.resolve(root, `tsconfig.json`),
  "/* This file is automatically generated by scripts/generators/tconfig.js */\n" +
    JSON.stringify(
      {
        extends: "./tsconfig.base.json",
        include: tsPkgs.map(({ relative }) => `${relative}/src/**/*.ts`),
        compilerOptions: {
          paths: Object.fromEntries(
            tsPkgs.map(({ name, relative }) => [name, [`${relative}/src`]])
          ),
        },
      },
      null,
      2
    )
);
