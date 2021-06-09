import React from 'react';
import classnames from 'classnames';
import { useInView } from 'react-intersection-observer';

import styles from './styles.module.less';

function isYoutubeVideo(url) {
  return (
    url.includes('https://www.youtube.com/embed/') ||
    url.includes('https://www.youtube-nocookie.com/embed/')
  );
}

export default ({ code }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
  });

  if (!code) {
    return null;
  }

  const iFrameSrcRegEx = new RegExp(/src="([^"]*)"|src='([^']*)'/g);
  const [, url] = iFrameSrcRegEx.exec(code);
  const baseClass = classnames(styles.wrapper, 'contained', 'contained_lg');
  // Treat YouTube embeds in a special way
  if (isYoutubeVideo(url)) {
    return (
      <div ref={ref} className={classnames(baseClass, styles.sixteenByNine)}>
        <div></div>
        {inView && (
          <iframe
            title="YouTube Video"
            width="100%"
            src={url}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    );
  }
  return (
    <div
      ref={ref}
      className={baseClass}
      dangerouslySetInnerHTML={{ __html: inView && code }}
    ></div>
  );
};
