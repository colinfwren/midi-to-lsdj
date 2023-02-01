module.exports = {
  extends: ['eslint:recommended'],
  root: true,
  overrides: [
    {
      extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
      files: ["src/**/*.ts"],
      plugins: [
          "@typescript-eslint"
      ],
      parser: '@typescript-eslint/parser',
    }
  ],
  ignorePatterns: ["dist", "coverage", "jest.config.js"]
};