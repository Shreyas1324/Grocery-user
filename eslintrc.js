module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:prettier/recommended",
  ],
  env: {
    node: true,
    jest: true,
  },
  rules: {
    // ✅ Add or override rules here
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "off",
    "prettier/prettier": ["error"],
    "@typescript-eslint/naming-convention": [
      "error",
      {
        selector: "parameterProperty",
        format: ["camelCase"],
        leadingUnderscore: "allow",
      },
      {
        selector: "property",
        format: ["camelCase", "snake_case"],
      },
      {
        selector: "variable",
        format: ["camelCase", "UPPER_CASE"],
        leadingUnderscore: "allow",
      },
      {
        selector: "parameter",
        format: ["camelCase"],
        leadingUnderscore: "allow",
      },
      {
        selector: "memberLike",
        modifiers: ["private"],
        format: ["camelCase"],
        leadingUnderscore: "require",
      },
      {
        selector: "typeLike",
        format: ["PascalCase"],
      },
      {
        selector: "enumMember",
        format: ["UPPER_CASE"],
      },
    ],
  },
  overrides: [
    {
      files: ["src/entities/**/*.ts"], // Adjust the path as necessary
      rules: {
        "@typescript-eslint/naming-convention": [
          "error",
          {
            selector: "parameter",
            format: ["camelCase", "snake_case"],
            leadingUnderscore: "allow",
          },
        ],
      },
    },
  ],
};