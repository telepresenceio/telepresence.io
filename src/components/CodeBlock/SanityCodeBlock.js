import React from 'react';
import CodeBlock from './CodeBlock';

export default ({ code, language }) => {
  return (
    <div className="code-block">
      <CodeBlock className={`language-${language || ''}`}>{code}</CodeBlock>
    </div>
  );
};
