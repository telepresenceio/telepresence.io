import React from "react";

const CodeBlock = (props) => {
  // When we call <CodeBlock> directly from JSX, we usually just pass
  // a raw string for props.children:
  //
  //     <CodeBlock PROPS>{"CONTENT"}</CodeBlock>
  //
  // When this is called from MDX as a code fence
  //
  //     ```LANG PROPS
  //     CONTENT
  //     ```
  //
  // MDX spits out
  //
  //     <pre><code class=language-LANG PROPS>CONTENT</code></pre>
  //
  // except that <pre> is hijacked replaced with <CodeBlock>.  In that
  // case, we actually care about the <code> block's props, not our
  // own; we care about `props.children.props` rather than `props`.
  if (props.children && props.children.props) {
    // Handle that MDX weirdness.  Merge the two, giving precedence to
    // props.children.props.
    props = { ...props, ...props.children.props };
  }
  return (
    <pre>
      {props.children}
    </pre>
  );
};

export default CodeBlock;
