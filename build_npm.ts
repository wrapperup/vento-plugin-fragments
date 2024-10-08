// ex. scripts/build_npm.ts
import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";

await emptyDir("./npm");

await build({
  entryPoints: ["./mod.ts"],
  packageManager: "pnpm",
  outDir: "./npm",
  compilerOptions: {
    target: "ES2022",
  },
  scriptModule: false,
  shims: {
    // see JS docs for overview and more options
    deno: true,
  },
  package: {
    // package.json properties
    name: "vento-plugin-fragments",
    version: Deno.args[0],
    description: "Adds support for template fragments in Vento",
    license: "MIT",
    repository: {
      type: "git",
      url: "git+https://github.com/wrapperup/vento-plugin-fragments.git",
    },
    bugs: {
      url: "https://github.com/wrapperup/vento-plugin-fragments/issues",
    },
  },
  mappings: {
    "https://deno.land/x/vento@v1.12.10/mod.ts": {
      name: "ventojs",
      version: "^1.12.10",
      peerDependency: true,
    },
    "https://deno.land/x/vento@v1.12.10/src/environment.ts": {
      name: "ventojs",
      version: "^1.12.10",
      peerDependency: true,
      subPath: "src/environment.js",
    },
    "https://deno.land/x/vento@v1.12.10/src/tokenizer.ts": {
      name: "ventojs",
      version: "^1.12.10",
      peerDependency: true,
      subPath: "src/tokenizer.js",
    },
  },
  postBuild() {
    // steps to run after building and before running the tests
    Deno.copyFileSync("LICENSE", "./npm/LICENSE");
    Deno.copyFileSync("README.md", "./npm/README.md");
  },
});
