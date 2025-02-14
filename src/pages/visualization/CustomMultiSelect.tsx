import React from 'react';
import './CustomMultiSelect.css';

// Define the types for the props
interface CustomMultiSelectProps {
  options: string[];
  selectedOptions: string[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>;
}

// Define the component
const CustomMultiSelect: React.FC<CustomMultiSelectProps> = ({ options, selectedOptions, setSelectedOptions }) => {
  // Handle option click
  const handleOptionClick = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((selected) => selected !== option));
    } else if (selectedOptions.length < 3) {
      setSelectedOptions([...selectedOptions, option]);
    } else {
      alert('You can select a maximum of 3 columns.');
    }
  };

  return (
    <div className="custom-multi-select">
      {options.map((option, index) => (
        <div
          key={index}
          className={`option ${selectedOptions.includes(option) ? 'selected' : ''}`}
          onClick={() => handleOptionClick(option)}
        >
          {option}
        </div>
      ))}
    </div>
  );
};

export default CustomMultiSelect;
