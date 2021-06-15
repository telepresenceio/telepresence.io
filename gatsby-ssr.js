// Fix a bug in gatsby where the gatsby-global-css headComponent doesn't have a
// key.
exports.onPreRenderHTML= ({ getHeadComponents, replaceHeadComponents }) => {
  replaceHeadComponents(getHeadComponents().map((c) => {
    if (c && c.props && c.props.id === "gatsby-global-css" && !c.key) {
      return {
        ...c,
        "key": "gatsby-global-css",
      };
    }
    return c;
  }));
};
