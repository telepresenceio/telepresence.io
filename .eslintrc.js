const fs = require('fs');
const graphql = require('graphql');
const gatsbyESLintConfig = require('gatsby/dist/utils/eslint-config');
const gatsbyWebpackUtils = require('gatsby/dist/utils/webpack-utils');

const graphQLSchema = (() => {
  let str;
  try {
    str = fs.readFileSync('./schema.graphql').toString();
  } catch (err) {
    console.log("Warning: File ./schema.graphql does not exist;\n"+
                "         ESLint output regarding GraphQL queries may be inaccurate.\n"+
                "         Run a Gatsby command to generate the schema file.")
    str = "type Query {\n\tempty(filter: Int!): Int\n}\n";
  }
  return graphql.buildSchema(str);
})();
const usingJSXRuntime = gatsbyWebpackUtils.reactHasJsxRuntime();

const baseConfig = gatsbyESLintConfig.eslintConfig(graphQLSchema, usingJSXRuntime).baseConfig;

module.exports = {
  ...baseConfig,

  ignorePatterns: [
    "/public/",
  ],
  rules: {
    ...baseConfig.rules,
  },
};
