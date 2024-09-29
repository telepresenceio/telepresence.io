import React, { useState } from 'react';

import ClipboardIcon from '../../assets/images/clipboard.inline.svg';
import ThumbsUpIcon from '../../assets/images/thumbs.inline.svg';
import styles from "./styles.module.scss";

const delay = (duration: number) =>
  new Promise((resolve) => setTimeout(resolve, duration));

function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      className={
        styles.CopyButton + ' ' + (copied ? styles.CopyButton__suceeded : '')
      }
      disabled={copied}
      onClick={async () => {
        navigator.clipboard.writeText(content).then(() => {
          console.log('set copied true');
          setCopied(true);
          delay(1500).then(() => {
            console.log('set copied false');
            setCopied(false);
          })
      })}}
    >
      <div className={styles.CopyButton__icons}>
        <div className={styles.CopyButton__mover}>
          <ClipboardIcon/>
          <ThumbsUpIcon/>
          <ClipboardIcon/>
        </div>
      </div>
      <span>copied</span>
    </button>
  );
}

export default CopyButton;
