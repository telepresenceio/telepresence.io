import React from 'react';

import Icon from '../Icon';
import './style.less';

interface IOption {
    id: string;
    name: string;
}

interface IFlyoutProps {
    options: IOption[];
    onSelect: (e: React.MouseEvent<HTMLLIElement, MouseEvent>, value: string) => void;
    selected: string;
}

const Flyout: React.FC<IFlyoutProps> = ({ options, onSelect, selected }): JSX.Element => (
    <div className="flyout">
        <ul>
            {options.map(option => (
                <li key={option.id} onClick={(e) => onSelect(e, option.id)} className={`${selected === option.id ? 'active' : ''}`}>
                    <Icon name="chevron-right-filled" className="icon" /> {option.name}
                </li>
            ))}
        </ul>
        <div className="caret"></div>
    </div>
)

export default Flyout;