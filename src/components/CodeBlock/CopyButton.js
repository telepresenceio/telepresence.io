import React, { useState } from 'react';

import styles from './styles.module.less';

import ThumbsUpIcon from '../../../static/images/doc-icons/thumbs.inline.svg';
import ClipboardIcon from '../../../static/images/doc-icons/clipboard.inline.svg';

const copyToClipboard = content => {
  const el = document.createElement('textarea');
  el.value = content;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el)
};

const delay = duration => new Promise(resolve => setTimeout(resolve, duration));

function CopyButton({ content }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      className={styles.CopyButton + ' ' + (copied ? styles.CopyButton__suceeded : '')}
      disabled={copied}
      onClick={async () => {
        copyToClipboard(content);

        setCopied(true);

        await delay(1500);

        setCopied(false);
      }}
    >
        <div className={styles.CopyButton__icons}>
            <div className={styles.CopyButton__mover}>
                <ClipboardIcon />
                <ThumbsUpIcon />
                <ClipboardIcon />
            </div>
        </div>
        <span>copied</span>
    </button>
  )
}

export default CopyButton;
