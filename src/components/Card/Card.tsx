import React from 'react';
import { Link } from 'gatsby';

import Icon from '../Icon/Icon';
import './style.less';

interface ICardProp {
  title: string;
  description: string;
  icon: string | undefined;
  link?: string;
  linkText?: string;
  classes?: string;
}

const Card: React.FC<ICardProp> = ({ icon, title, description, link, linkText, classes }): JSX.Element => (
  <div className={`${classes ? 'card-item ' + classes : 'card-item'}`}>
    <div className="card-item--heading">
      {icon && <Icon name={icon} />}
      {title}
    </div>
    <p className="card-item--text">{description}</p>
    {link && linkText && <Link to={link} className="card-item--button">
      {linkText} <Icon name="right-arrow" className="card-item--button--arrow" />
    </Link>}
  </div>
);

export default Card;