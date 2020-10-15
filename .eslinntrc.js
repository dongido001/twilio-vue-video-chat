module.exports = {
    // ...
    extends: [
      // ...
      'eslint:recommended',
      // ...
      'plugin:vue/vue3-recommended',
      // ...
      "prettier/vue",
    ],
    rules: {
        "space-before-function-paren": ["error", "never"]
    }
  }