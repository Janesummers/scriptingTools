module.exports = {
  "env": {
    "browser": true,
    "node": true,
    "es6": true,
    "es2021": true
  },
  // "extends": "eslint:recommended",
  "extends": ["eslint:recommended", "plugin:userscripts/recommended"],
  "overrides": [
    {
      "env": {
        "node": true
      },
      "files": [
        ".eslintrc.{js,cjs}"
      ],
      "parserOptions": {
        "sourceType": "script"
      }
    }
  ],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "rules": {
    "indent": ["error", 2]
  }
}
