import React from 'react';

import CollapseItem from './CollapseItem';
import './style.less';

export interface IItem {
  title: string;
  icon: string | undefined;
  content: JSX.Element;
  itemClassName?: string;
}

interface ICollapseProps {
  items: IItem[];
}

const Collapse: React.FC<ICollapseProps> = ({ items }): JSX.Element => (
  <ul className="collapse">
    {items.map(item => <CollapseItem
      key={item.title.replace(/\s+/g, '-').toLowerCase()}
      item={item}
    />)}
  </ul>
);

export default Collapse;