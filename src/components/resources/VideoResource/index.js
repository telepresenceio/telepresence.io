import React from 'react';
import styles from './styles.module.less';
import {MDXRenderer} from "gatsby-plugin-mdx";

const VideoResource = ({ title, youtube_embed, description }) => (
  <div className={styles.ResourcePage}>
    <div className={styles.Container}>
      <div className={styles.Title}>
        <h1>{title}</h1>
      </div>
      <div className={styles.Video}>
        <div className={styles.VideoWrapper}>
          <iframe
            title="resource-video"
            width="560"
            height="315"
            src={youtube_embed}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
      <div className={styles.Description}>
        <MDXRenderer>{description}</MDXRenderer>
      </div>
    </div>
  </div>
);

export default VideoResource;
