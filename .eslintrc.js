const path = require('path');

module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier", "import"],
  rules: {
    quotes: [2, "single"],
    "prettier/prettier": ["error", { singleQuote: true }],
    "no-param-reassign": "off",
    "no-underscore-dangle": "off",
    "no-plusplus": "off",
    "no-console": ["error", { allow: ["warn", "error"] }],
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_", "ignoreRestSiblings": true }],
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/naming-convention": "off",
    "@typescript-eslint/no-unnecessary-type-assertion": "off",
    "import/prefer-default-export": "off",
    "import/no-extraneous-dependencies": "off",
    "import/order": [
      "error",
      {
        groups: [
          ["builtin", "external"],
          "internal",
          ["sibling", "parent", "index"],
        ],
        pathGroups: [
          {
            pattern: "@reduxjs/**",
            group: "external",
          },
        ],
        "newlines-between": "always",
        warnOnUnassignedImports: true,
      },
    ],
    "prettier/prettier": ["error", { singleQuote: true }],
    quotes: [2, "single"],
  },
  settings: {
    "import/internal-regex": "^@.*",
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "airbnb",
    "airbnb-typescript",
    "plugin:prettier/recommended",
    "prettier",
  ],
  parserOptions: {
    project: path.resolve(__dirname, "tsconfig.json"),
    sourceType: "module",
  },
};
