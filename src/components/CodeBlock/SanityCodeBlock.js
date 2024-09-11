import React from 'react';

import CodeBlock from './CodeBlock';

const SanityCodeBlock = ({ code, language }) => {
  return (
    <div className="code-block">
      <CodeBlock className={`language-${language || ''}`} lineNumber={true}>
        {code}
      </CodeBlock>
    </div>
  );
};
export default SanityCodeBlock;