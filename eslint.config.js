import { defineConfig } from "eslint/config";
import config from "eslint-config-mlauffer-nodejs";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    ignores: [
      ".wrangler/",
      "dist/",
      "examples/openui5-sample-app*",
      "examples/ui5-typescript-helloworld",
      "**/coverage/",
    ],
  },
  {
    extends: [config, tseslint.configs.strict],
    rules: {
      "jsdoc/require-param": "off",
      "jsdoc/require-returns": "off",
      "sonarjs/todo-tag": "warn",
      "sonarjs/no-skipped-tests": "warn",
    },
  },
);
