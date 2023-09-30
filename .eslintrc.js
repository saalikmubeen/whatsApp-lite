module.exports = {
    extends: ["@react-native-community", "eslint-config-prettier", "prettier"],
    rules: {
        quotes: [2, "double", { avoidEscape: true }],
        indent: ["error", 4],
    },
};

// npx husky install
// npx husky add .husky/pre-commit "npx --no-install lint-staged"

// Add the following to package.json file
// {   ...rest of package.json file
//     "private": true,
//     "husky": {
//         "hooks": {
//             "pre-commit": "lint-staged"
//         }
//     },
//     "lint-staged": {
//         "*.{ts,tsx,js}": [
//             "eslint --fix",
//             "prettier --write"
//         ]
//     }
// }
