import React from 'react';
import { useInView } from 'react-intersection-observer';

import styles from '../Embed/styles.module.less';

function extractIdFromUrl(url) {
  // See: https://regexr.com/3afhu
  /*eslint-disable */
  // ESLint complains about unnecessary escape characters, so we have to silent it
  const regex = new RegExp(
    /(?:(?:https?:)?\/\/)?(?:www\.)?youtu(?:be\.com\/(?:watch\?(?:.*?&(?:amp;)?)*v=|v\/|embed\/)|\.be\/)([\w‌​\-]+)(?:(?:&(?:amp;)?|\?)[\w\?=]*)*/g,
  );
  /*eslint-enable */
  const result = regex.exec(url);
  return result && result[1];
}

export const YoutubeVideo = ({ url }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
  });

  const videoId = extractIdFromUrl(url || '');

  if (!videoId) {
    return null;
  }

  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;

  return (
    <div ref={ref} className={styles.sixteenByNine}>
      <div></div>
      {inView && (
        <iframe
          title="YouTube Video"
          width="100%"
          src={embedUrl}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
};
