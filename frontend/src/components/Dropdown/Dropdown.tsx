import React, { useState, useRef, useEffect } from 'react';
import styles from './Dropdown.module.css';

interface DropdownOption {
  value: string;
  label: string;
}

interface DropdownProps {
  options: DropdownOption[];
  selectedOption: DropdownOption | null;
  onOptionSelect: (option: DropdownOption) => void;
  placeholder: string;
  className?: string; // Add className prop
}

const Dropdown: React.FC<DropdownProps> = ({ options, selectedOption, onOptionSelect, placeholder, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: DropdownOption) => {
    onOptionSelect(option);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className={`${styles.dropdown} ${className}`} ref={dropdownRef}>
      <div className={styles.dropdownTrigger} onClick={toggleDropdown}>
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <div className={styles.arrow}></div>
      </div>
      {isOpen && (
        <div className={styles.dropdownOptions}>
          {options.map((option) => (
            <span
              key={option.value}
              className={`${styles.dropdownOption} ${option.value === selectedOption?.value ? styles.selected : ''}`}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;