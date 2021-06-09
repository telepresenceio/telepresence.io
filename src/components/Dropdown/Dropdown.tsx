import React from 'react';

import Icon from '../Icon';
import './style.less';

interface IOption {
    id: string;
    name: string;
}

interface IDropdownProps {
    label: string;
    handleOnChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    value: string;
    options: IOption[];
}

const Dropdown: React.FC<IDropdownProps> = ({ label, handleOnChange, value, options }): JSX.Element => (
    <div className="custom-dropdown">
        <label>{label}</label>
        <Icon name="chevron-down" className="custom-dropdown__chevdown" />
        <select onChange={handleOnChange} value={value}>
            {options.map(option => (
                <option
                    value={option.id}
                    key={option.id}
                >{option.name}</option>
            ))}
        </select>
    </div>
);

export default Dropdown;