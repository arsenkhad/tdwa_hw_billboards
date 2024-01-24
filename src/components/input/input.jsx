import React, { useState } from 'react';
import "./input.css"

const Input = ({placeholder, input, modify}) => {
    const [inputValue, setInputValue] = useState('');

    const handleChange = (event) => {
        setInputValue(event.target.value);
        input(event.target.value)
    };

    return (
        <input
            className={modify}
            type="text"
            id="input"
            value={inputValue}
            onChange={handleChange}
            placeholder={placeholder}
        />
    );
};

export default Input;
