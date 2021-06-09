import React from 'react';

import Button from '../Button/Button';
import styles from './styles.module.less';
import { SECTION_COLOR_MAPPINGS } from '../../utils/colors';

export const SingleCTA = ({
  url,
  btnColor,
  newWindow,
  label,
  colorMapping = {},
  size,
}) => {
  if (!url) {
    return null;
  }
  return (
    <Button
      to={url}
      color={btnColor && btnColor !== 'auto' ? btnColor : colorMapping.button}
      newWindow={newWindow}
      size={size}
    >
      {label}
    </Button>
  );
};

export const MultipleCTAs = ({ ctas = [], colorMapping = {}, size }) => {
  if (!Array.isArray(ctas) || !ctas.length) {
    return null;
  }
  return (
    <p className={styles.container}>
      {ctas.map((item) => {
        return (
          <SingleCTA
            key={item.url}
            {...item}
            colorMapping={colorMapping}
            size={size}
          />
        );
      })}
    </p>
  );
};

export const CtaRow = ({ ctas = [], size }) => (
  <MultipleCTAs
    ctas={ctas}
    colorMapping={SECTION_COLOR_MAPPINGS['#fff']}
    size={size}
  />
);
