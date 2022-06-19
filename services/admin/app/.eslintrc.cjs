module.exports = {
  extends: '@callstack/eslint-config/node',
  overrides: [
    {
      files: ['vite.config.ts'],
      rules: {
        'import/no-extraneous-dependencies': 0,
      },
    },
  ],
};
