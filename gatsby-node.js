const path = require('path');

// Some of the files in the docs subtrees want to import site-global
// things from the 'src/' directory.  Let them do this with the
// "@src/" alias, instead of making them learn how many "../" to put
// to get up to the root.
exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      alias: {
        "@src": path.resolve(__dirname, "src"),
      },
    },
  });
};
