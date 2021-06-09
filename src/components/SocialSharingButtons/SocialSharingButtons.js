import React from 'react';

import styles from './styles.module.less';
import { usePageUrl } from '../../utils/urls';
import { TwitterLogo, FacebookLogo, LinkedinLogo } from '../icons/socialIcons';

export default ({ title, className }) => {
  const sharingUrl = usePageUrl() || '';
  if (!sharingUrl) {
    return null;
  }
  return (
    <div className={className || styles.wrapper}>
      {title && <h2>{title}</h2>}
      <a
        rel="noopener noreferrer"
        target="_blank"
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
          sharingUrl,
        )}`}
        aria-label="Share on Twitter"
        title="Share on Twitter"
      >
        <TwitterLogo />
      </a>
      <a
        rel="noopener noreferrer"
        target="_blank"
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          sharingUrl,
        )}`}
        aria-label="Share on Facebook"
        title="Share on Facebook"
      >
        <FacebookLogo />
      </a>
      <a
        rel="noopener noreferrer"
        target="_blank"
        href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
          sharingUrl,
        )}`}
        aria-label="Share on LinkedIn"
        title="Share on LinkedIn"
      >
        <LinkedinLogo />
      </a>
    </div>
  );
};
