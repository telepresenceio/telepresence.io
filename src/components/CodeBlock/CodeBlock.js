import Highlight, { defaultProps } from 'prism-react-renderer';
import React from 'react';
import { useInView } from 'react-intersection-observer';

import CodeIcon from '../../../static/images/doc-icons/code.inline.svg';
import TerminalIcon from '../../../static/images/doc-icons/terminal.inline.svg';

import CopyButton from './CopyButton';
import * as styles from './styles.module.less';

const ps1regex = /^(\$|\/ambassador #|localhost\$|kubernetes#|@minikube\|\$) /;

/*
 * MDX passes the code block as JSX
 * we un-wind it a bit to get the string content
 * but keep it extensible so it can be used with just children (string) and className
 *
 * The original version of this code was copied from
 * https://github.com/gatsbyjs/gatsby/pull/15834 but has since been modified.
 */
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
  const className = props.className || '';
  const fileName = props.fileName || '';
  const content = props.children || '';

  let language = className.replace(/^language-/, '');
  if (!language) {
    // This reasonably mimics the early-2021 behavior, while being a
    // reasonably safe default now that we actually care about whether
    // the console blocks have a PS1 prompt.
    //
    // We should eventually make it an error to use the default, and
    // force the doc authors to specify every time.
    language = content.match(ps1regex) ? 'console' : 'shell';
  }
  switch (language) {
    case 'console':
      if (!content.match(ps1regex)) {
        throw Error(
          `CodeBlock language=${language}: Could not identify PS1: ${
            content.split('\n')[0]
          }`,
        );
      }
      let sections = [[]];
      let heredoc = '';
      for (let line of content.split('\n')) {
        let section = sections[sections.length - 1];
        section.push(line);

        let endOfSection = true;

        if (heredoc) {
          if (line === heredoc) {
            heredoc = '';
          } else {
            endOfSection = false;
          }
        } else if (section.join('\n').match(ps1regex)) {
          // In an input block, do minimal parsing of Bash syntax to
          // determine if this is a multi-line command.
          let m = line.match(/[^<]<<([a-zA-Z_]+)$/);
          if (m) {
            heredoc = m[1];
            endOfSection = false;
          } else if (line.endsWith('\\')) {
            endOfSection = false;
          }
        }

        if (endOfSection) {
          sections.push([]);
        }
      }
      return (
        <div className={styles.CodeBlock__light}>
          <div className={styles.CodeBlock__header}>
            <span className="codeBlockText">
              <TerminalIcon loading="lazy" />
              Terminal
            </span>
          </div>
          <pre className={`language-${language}`}>
            {sections.map((section, index) => {
              const sectionText = section.join('\n');
              const ps1match = sectionText.match(ps1regex);
              if (ps1match) {
                return (
                  <div className="console-input language-shell" key={index}>
                    <CopyButton
                      content={sectionText.slice(ps1match[0].length)}
                    />
                    <div className="copy-content">
                      <Highlight
                        {...defaultProps}
                        code={sectionText.slice(ps1match[0].length)}
                        language="shell"
                        theme={undefined}
                      >
                        {({ tokens, getLineProps, getTokenProps }) =>
                          tokens.map((line, i) => {
                            const lineProps = getLineProps({ line, key: i });
                            return (
                              <div key={i} {...lineProps}>
                                {i === 0 ? ps1match[0] : ''}
                                {line.map((token, key) => {
                                  let tokenProps = getTokenProps({
                                    token,
                                    key,
                                  });
                                  tokenProps.className = `${tokenProps.className} codeBlockText`;
                                  return <span key={key} {...tokenProps} />;
                                })}
                              </div>
                            );
                          })
                        }
                      </Highlight>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div className="console-output" key={index}>
                    {section.map((line, idx) => (
                      <div className="token-line" key={idx}>
                        <span className="token plain codeBlockText">
                          {line}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }
            })}
          </pre>
        </div>
      );

    default:
      return (
        <Highlight
          {...defaultProps}
          code={content}
          language={props.language ?? language}
          theme={undefined}
        >
          {({ tokens, getLineProps, getTokenProps }) => (
            <div className={styles.CodeBlock__light}>
              <div className={styles.CodeBlock__header}>
                <span className="codeBlockText">
                  <CodeIcon loading="lazy" />
                  {props.language ?? language}
                </span>
                <CopyButton fileName={fileName} content={content} />
              </div>
              <pre className={`language-${language}`}>
                {tokens.map((line, i) => {
                  const lineProps = getLineProps({ line, key: i });
                  const className = [lineProps.className];
                  return (
                    <div
                      key={i}
                      {...Object.assign({}, lineProps, {
                        className,
                      })}
                    >
                      {props.lineNumber && (
                        <span className={`${styles.LineNumber} codeBlockText`}>
                          {i + 1}
                        </span>
                      )}

                      {line.map((token, key) => {
                        let tokenProps = getTokenProps({ token, key });
                        tokenProps.className = `${tokenProps.className} codeBlockText`;
                        return <span key={key} {...tokenProps} />;
                      })}
                    </div>
                  );
                })}
              </pre>
            </div>
          )}
        </Highlight>
      );
  }
};

const Wrapper = (props) => {
  const [wrapperRef, inView] = useInView({
    triggerOnce: true,
    rootMargin: '0px 0px 300px 0px',
  });

  return (
    <>
      <span ref={wrapperRef} />
      {inView && <CodeBlock {...props} />}
    </>
  );
};

export default Wrapper;
