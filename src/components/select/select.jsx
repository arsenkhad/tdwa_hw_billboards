import React, { useEffect, useState } from 'react';
import "./select.css"

const Select = ({ options, onSelect, selected }) => {
    const [selectedOption, setSelectedOption] = useState(options.length !== 0 ? selected : "");

    useEffect(() => {
        onSelect(selectedOption);
    }, []);

    const handleSelectChange = (event) => {
        const selectedValue = event.target.value;
        setSelectedOption(selectedValue);
        onSelect(selectedValue);
    };

    return (
        <select className="custom-select" onChange={handleSelectChange}>
            {options.map((option) => (
                <option key={option.id} value={option.id} selected={(option.id === selected)}>
                    {option.address}
                </option>
            ))}
        </select>
    );
};

export default Select;
