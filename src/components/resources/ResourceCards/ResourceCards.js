import React from 'react';
import classnames from 'classnames';

import ResourceLink from '../ResourceLink';
import RichText from '../../RichText/RichText';
import { removeDoubleSlashes } from '../../../utils/urls';

import styles from './styles.module.less';

function parseItemProps(item) {
  // Check if url points to an external page
  const isAbsLink = item.url && item.url.includes('http');
  // If an internal page, wrap the URL in slashes to prevent faulty links
  const url = isAbsLink ? item.url : removeDoubleSlashes(`/${item.url}/`) || '';
  return {
    ...item,
    url,
  };
}

export default ({
  body,
  children,
  hideType,
  isPreview = false,
  resources,
  setRef,
  title
}) => {
  const wrapperEl = React.useRef(null);

  React.useEffect(() => {
    if (wrapperEl && wrapperEl.current && setRef) {
      setRef(wrapperEl);
    }
  }, [setRef]);
  if (!resources || !resources.length) {
    return isPreview ? 'No resources found' : null;
  }
  return (
    <section ref={wrapperEl} className={classnames(styles.wrapper)}>
      {title && <h2>{title}</h2>}
      {body && <RichText className={styles.body} blocks={body} />}
      <div className={classnames(styles.container)}>
        {Array.isArray(resources) &&
          resources.length &&
          resources.map((item, i) => (
            <ResourceLink
              key={item.url || `resource-${i}`}
              {...parseItemProps(item)}
              isH2={!title}
              hideType={hideType}
            />
          ))}
      </div>
      {children}
    </section>
  );
};
