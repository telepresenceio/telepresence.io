import React from 'react';
import MDX from '@mdx-js/runtime';

import CodeBlock from '../CodeBlock';

export const components = {
  // Override default markdown output.
  'pre': CodeBlock,

  // Add new custom components.
  // (none right now)
};

export default function Markdown({ children }) {
  return <MDX components={components}>{children}</MDX>;
}
