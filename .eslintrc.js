module.exports = {
    "env": {
        "node": true,
        "es2021": true
    },
    "extends": "eslint:recommended",
    "plugins": ["node"],
    "parserOptions": {
        "ecmaVersion": 12
    },
    "rules": {
        "node/no-missing-require": "error",
        "no-unused-vars": "warn"
    }
}
