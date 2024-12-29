import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import functionName from "eslint-plugin-function-name";
import cspell from "@cspell/eslint-plugin";
import typescript from "@typescript-eslint/eslint-plugin";
import sonarjs from "eslint-plugin-sonarjs";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    ignores: ["eslint.*"],
    plugins: {
      "function-name": functionName,
      "@cspell": cspell,
      typescript,
      sonarjs,
    },
    languageOptions: {
      parser: "@typescript-eslint/parser",
      ecmaVersion: 2020,
      sourceType: "module",
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    rules: {
      "function-name/starts-with-verb": "error",
      "@cspell/spellchecker": [
        "error",
        {
          checkComments: true,
          checkStringTemplates: true,
          checkStrings: true,
          checkIdentifiers: true,
          cspell: {
            words: [],
          },
        },
      ],
      "new-cap": [
        "error",
        {
          newIsCap: true,
          capIsNew: false,
          properties: false,
          capIsNewExceptions: ["Router"],
        },
      ],
      "id-length": [
        "error",
        {
          min: 3,
          max: 25,
          exceptions: ["_"],
        },
      ],
      "max-params": ["error", 3],
      "max-depth": ["error", 2],
      "max-nested-callbacks": ["error", 1],
      "max-len": [
        "error",
        {
          code: 80,
          tabWidth: 2,
          ignoreUrls: false,
          ignoreRegExpLiterals: false,
          ignoreStrings: false,
          ignoreTemplateLiterals: false,
        },
      ],
      "max-lines-per-function": [
        "error",
        {
          max: 50,
          skipBlankLines: false,
          skipComments: false,
        },
      ],
      "consistent-return": "error",
      indent: ["error", 2, { SwitchCase: 1 }],
      "no-else-return": "error",
      semi: ["error", "always"],
      "space-unary-ops": "error",
      camelcase: ["error", { properties: "always" }],
      "no-warning-comments": [
        "error",
        {
          terms: ["todo", "fixme", "hack"],
          location: "anywhere",
        },
      ],
      "no-unused-vars": [
        "error",
        {
          args: "after-used",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
        },
      ],
      "no-console": "error",
      "no-var": "error",
      "prefer-const": "error",
      "prefer-arrow-callback": "error",
      "arrow-body-style": ["error", "as-needed"],
      "no-duplicate-imports": "error",
      "object-shorthand": ["error", "always"],
      "quote-props": ["error", "as-needed"],
      "no-useless-return": "error",
      "require-await": "error",
      "no-shadow": [
        "error",
        {
          builtinGlobals: true,
          hoist: "all",
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/explicit-function-return-type": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/member-ordering": [
        "error",
        {
          default: [
            "public-static-field",
            "protected-static-field",
            "private-static-field",
            "public-instance-field",
            "protected-instance-field",
            "private-instance-field",
            "constructor",
            "public-method",
            "protected-method",
            "private-method",
          ],
        },
      ],
      "@typescript-eslint/explicit-module-boundary-types": "error",
      "@typescript-eslint/no-empty-interface": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "sonarjs/cognitive-complexity": ["error", 15],
      "sonarjs/no-duplicate-string": "error",
      "sonarjs/no-identical-functions": "error",
      "sonarjs/no-collapsible-if": "error",
      "sonarjs/no-redundant-boolean": "error",
      "sonarjs/no-inverted-boolean-check": "error",
      "sonarjs/prefer-immediate-return": "error",
      "sonarjs/no-small-switch": "error",
      "sonarjs/no-unused-collection": "warn",
      "sonarjs/prefer-single-boolean-return": "error",
    },
  },
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];
