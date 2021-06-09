import React from 'react';
import classnames from 'classnames';

import RichText from '../RichText/RichText';

import styles from './styles.module.less';

export default ({ blocks }) => {
  const removeBottomPadding = React.useMemo(() => {
    const lastBlock = blocks[blocks.length - 1];

    return (
      ['titleCta', 'mediaColumns'].indexOf(lastBlock._type) >= 0 &&
      lastBlock.bgColor &&
      lastBlock.bgColor !== '#ff'
    );
  }, [blocks]);
  return (
    <main
      className={classnames(
        styles.wrapper,
        removeBottomPadding && styles.noPadding,
      )}
    >
      <RichText blocks={blocks} renderContainerOnSingleChild={true} />
    </main>
  );
};
