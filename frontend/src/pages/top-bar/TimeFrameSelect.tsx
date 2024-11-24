import React, { useState, useEffect, useRef } from 'react';
import styles from './TimeFrameSelect.module.css';

const TimeFrameSelect = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('Past Week');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
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
    <div className={styles.timeFrameContainer}>
      <label htmlFor="time-frame">Time Frame:</label>
      <div className={styles.customSelectWrapper} ref={dropdownRef}>
        <div className={styles.customSelect} onClick={toggleDropdown}>
          <div className={styles.customSelectTrigger}>
            <span>{selectedOption}</span>
            <div className={styles.arrow}></div>
          </div>
          {isOpen && (
            <div className={styles.customOptions}>
              <span className={`${styles.customOption} ${selectedOption === 'Past Week' ? styles.selected : ''}`} onClick={() => handleOptionClick('Past Week')}>Past Week</span>
              <span className={`${styles.customOption} ${selectedOption === 'Past Month' ? styles.selected : ''}`} onClick={() => handleOptionClick('Past Month')}>Past Month</span>
              <span className={`${styles.customOption} ${selectedOption === 'Past 3 Months' ? styles.selected : ''}`} onClick={() => handleOptionClick('Past 3 Months')}>Past 3 Months</span>
              <span className={`${styles.customOption} ${selectedOption === 'Past 6 Months' ? styles.selected : ''}`} onClick={() => handleOptionClick('Past 6 Months')}>Past 6 Months</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeFrameSelect;