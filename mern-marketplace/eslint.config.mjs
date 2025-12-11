import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";

export default defineConfig([

  {
    ignores: ["server/express.js"],
  },


  {
    files: ["client/**/*.{js,jsx,mjs}"],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
      globals: { ...globals.browser, process: "readonly", require: "readonly" },
    },
    plugins: { react: pluginReact },
    extends: [js.configs.recommended],
    rules: {
      "no-unused-vars": "off",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off"
    },
    settings: { react: { version: "detect" } },
  },

  {
    files: ["server/**/*.{js,mjs,cjs}"],
    languageOptions: {
      parserOptions: { ecmaVersion: "latest", sourceType: "module" },
      globals: { ...globals.node },
    },
    extends: [js.configs.recommended],
    rules: {
      "no-unused-vars": "off",
      "react/prop-types": "off"
    },
  },
]);
