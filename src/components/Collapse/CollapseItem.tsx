import React, { useState } from 'react';

import Icon from '../Icon';
import { IItem } from './Collapse';

interface ICollapseItemProps {
  item: IItem;
}

const CollapseItem: React.FC<ICollapseItemProps> = ({ item }): JSX.Element => {
  const { icon, title, content, itemClassName } = item;
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleClickItem = (e) => setIsOpen(!isOpen);

  return (
    <li>
      <div className={`collapse__item-heading ${itemClassName ? itemClassName : ''}`} onClick={handleClickItem}>
        {icon && <Icon name={icon} className="collapse--icon" />}
        <span className="collapse--text">{title}</span>
        <Icon name="chevron-down" className={`${isOpen ? 'collapse--chevron collapse--chevron--open' : 'collapse--chevron'}`} />
      </div>
      {isOpen && <div className="collapse__item-content">{content}</div>}
    </li>
  )
};

export default CollapseItem;