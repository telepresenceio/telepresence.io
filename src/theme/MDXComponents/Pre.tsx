import React, {FC, JSX} from 'react';
import Pre from '@theme-original/MDXComponents/Pre';
import type PreType from '@theme/MDXComponents/Pre';
import {useColorMode} from '@docusaurus/theme-common';
import type {WrapperProps} from '@docusaurus/types';
import styles from "./styles.module.scss";
import TerminalIcon from "@site/src/assets/images/terminal.inline.svg";
import CopyButton from "./CopyButton";
import {Highlight, RenderProps, themes} from "prism-react-renderer";

type Props = WrapperProps<typeof PreType>;

const ps1regex = /^\$ /;

const ConsoleBlock: FC<typeof Pre> = (props) => {
	const language = 'console';
	const content = props.children ? props.children.toString().trimEnd() : '';

	if (!content.match(ps1regex)) {
		throw Error(
			`CodeBlock language=${language}: Could not identify PS1: ${
				content.split('\n')[0]
			}`,
		);
	}
	let sections: string[][] = [[]];
	let heredoc = '';
	for (const line of content.split('\n')) {
		const section = sections[sections.length - 1];
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

	const {colorMode} = useColorMode();
	const themeClass = colorMode === 'dark'?styles.CodeBlock__dark:styles.CodeBlock__light
	const hlThemeClass = colorMode === 'dark'?themes.vsDark:themes.vsLight
	return (
		<div className={themeClass}>
			<div className={styles.CodeBlock__header}>
            <span className="codeBlockText">
              <TerminalIcon/>
              Terminal
            </span>
			</div>
			<pre className={`language-console`}>
        {sections.map((section, index) => {
          const sectionText = section.join('\n');
          const ps1match = sectionText.match(ps1regex);
          if (ps1match) {
            return (
              <div className="console-input" key={index}>
                <CopyButton
	                key={`copy-${index}`}
                  content={sectionText.slice(ps1match[0].length)}
                />
                <div className="copy-content">
                  <Highlight
	                  key={`high-${index}`}
                    code={sectionText.slice(ps1match[0].length)}
                    language="shell"
                    theme={hlThemeClass}
                  >
                    {({tokens, getLineProps, getTokenProps}: RenderProps) => (
                      <div key={index}>
                        {tokens.map((line, i) => {
                          const lineProps = getLineProps({line: line, key: i});
                          return (
                            <div key={i} className={lineProps.className} style={lineProps.style}>
                              {i === 0 ? ps1match[0] : ''}
                              {line.map((token, key) => {
                                let tokenProps = getTokenProps({
                                  token,
                                  key,
                                });
                                tokenProps.className = `${tokenProps.className} codeBlockText`;
                                return <span
	                                key={key}
	                                className={tokenProps.className}
	                                style={tokenProps.style}
	                                children={tokenProps.children}/>;
                              })}
                            </div>
                          );
                        })}
                      </div>
                    )}
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
}

export default function PreWrapper(props: Props): JSX.Element {
	const {children} = props as typeof Pre;
	const elProps = children.props;
	if (elProps.className == "language-console") {
		return (
			<ConsoleBlock {...elProps}/>
		)
	}
	return (
		<>
			<Pre {...props} />
		</>
	);
}
