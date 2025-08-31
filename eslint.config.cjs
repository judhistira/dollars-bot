const globals = require("globals");
const pluginJs = require("@eslint/js");
const pluginImport = require("eslint-plugin-import");

module.exports = [
  {
    ignores: ["node_modules/", "dist/", "legacy/"],
  },
  pluginJs.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      import: pluginImport,
    },
    rules: {
      // Add any specific rules here
    },
  },
];