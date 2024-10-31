const globals = require("globals");
const pluginJs = require("@eslint/js");
const typescriptLint = require("typescript-eslint");
const pluginReact = require("eslint-plugin-react");
const pluginJest = require("eslint-plugin-jest");

module.exports = [
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"]
  },
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...pluginJest.environments.globals.globals,
        process: "readonly"
      }
    }
  },
  pluginJs.configs.recommended,
  ...typescriptLint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    settings: {
      react: {
        version: "detect", // Automatically detect the version of React
      },
    },
    rules: {
      quotes: ["error", "double"], // Enforce double quotes
    }
  }
];
