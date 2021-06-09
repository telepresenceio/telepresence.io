import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import styles from './styles.module.less';
import TerminalIcon from '../../../static/images/doc-icons/terminal.inline.svg';
import CodeIcon from '../../../static/images/doc-icons/code.inline.svg';
import CopyButton from '../CodeBlock/CopyButton';
import AppleIcon from '../../../static/images/doc-icons/apple.inline.svg';
import IconLinux from '../../../static/images/doc-icons/linux.inline.svg';

const CodeBlockMultiLang = (props) => {
  let os = 'other';

  const [tabs, setTabs] = useState([]);
  const [myType, setMyType] = useState("terminal");
  const [currentTab, setCurrentTab] = useState({});
  useEffect(() => {
    if (/Mac(intosh|Intel|PPC|68K)/.test(window.navigator.platform)) {
      os = 'macos';
    } else if (/Win(dows|32|64|CE)/.test(window.navigator.platform)) {
      os = 'windows';
    } else if (/Linux/.test(window.navigator.platform)) {
      os = 'linux';
    }
    if (os === 'windows' || os === 'other') {
      // Display the macos instructions for now since we don't have a Windows binary!
      os = 'macos';
    }
    props.state.os = os;
    setTabs(props.data.tabs);
    setMyType(props.type);
    if (props.data.tabs.filter(t => t.os && t.os === props.state.os).length > 0) {
      setCurrentTab(props.data.tabs.filter(t => t.os && t.os === props.state.os)[0]);
    } else {
      setCurrentTab(props.data.tabs[0]);
    }
    props.state.tabChangedSubscribers.push(onTabChanged);
  }, []);

  const onTabChanged = (tab) => {
    if (currentTab.id !== tab.id && props.data.tabs.filter(t => t.id === tab.id).length > 0) {
      setCurrentTab(props.data.tabs.filter(t => t.id === tab.id)[0]);
    }
  }

  useEffect(() => {
    props.state.tabChangedSubscribers.forEach(element => {
      element(currentTab);
    });
  }, [currentTab]);


  return (
    <div className={classNames(styles.codeBlockWrapper)}>
      {tabs && tabs.length > 1 ? (
        <div className={classNames(styles.codeBlockChoices, styles.codeBlockHeader)}>
          {tabs.map((tab) => {

            return (
              <div className={classNames(styles.codeBlockChoice, currentTab.id === tab.id ? styles.selected : '')} onClick={() => setCurrentTab(tab)}>
                {tab.os && tab.os !== "" ? (tab.os === "linux" ? (<IconLinux />) : (<AppleIcon />)) : (<></>)}
                {tab.display}
              </div>
            )
          })}
        </div>
      ) : null}

      <div className={classNames(styles.codeBlockHeader)}>
        <div className={classNames(styles.codeBlockType)}>
          {myType === "terminal"
            ? (
              <>
                <TerminalIcon />
                Terminal
              </>
            )
            : (
              <>
                <CodeIcon />
                Code
              </>
            )}

        </div>
        <CopyButton
          fileName=''
          content={currentTab.commands ? currentTab.commands.map((command) => {
            let commandContent = "";
            if (command.comments) {
              command.comments.forEach((comment) => commandContent += comment.trim() + '\n');
            }
            commandContent += command.input.trim() + '\n';
            return commandContent;
          }).join('') : ""} />
      </div>
      <div className={classNames(styles.codeBlocks)}>
        {currentTab.commands ?
          currentTab.commands.map((command) => {
            return (<div className={classNames(styles.codeBlockContentWrapper)}>
              {command.comments ?
                command.comments.map((comment) => {
                  return (<div className={classNames(styles.codeBlockOutput)}>
                    {comment}
                  </div>);
                })
                : null}
              <div className={classNames(styles.codeBlockContent)}>
                {currentTab.prompt} {command.input}
              </div>

              {command.outputs ?
                command.outputs.map((currentOutput) => {
                  return (<div className={classNames(styles.codeBlockOutput)}>
                    {currentOutput}
                  </div>);
                })
                : null}

            </div>);
          })
          : null}
      </div>
    </div>
  )
}


export { CodeBlockMultiLang }
