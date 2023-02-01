module.exports = {
  extends: [
      'eslint:recommended',
      'plugin:jsdoc/recommended'
  ],
  root: true,
  plugins: [
      "jsdoc"
  ],
  overrides: [
    {
      extends: [
          'eslint:recommended',
          'plugin:@typescript-eslint/recommended',
      ],
      files: ["src/**/*.ts", "src/**/*.spec.ts"],
      plugins: [
          "@typescript-eslint",
      ],
      parser: '@typescript-eslint/parser',
    }
  ],
  ignorePatterns: ["dist", "coverage", "jest.config.js"],
  rules: {
      'jsdoc/require-jsdoc': [
          'error',
          // {
          //     'require': {
          //         'FunctionDeclaration': true
          //     }
          // }
      ]
  }
};