import React, { useState, useEffect, useRef } from 'react';
import styles from './TimeFrameSelect.module.css';

interface TimeFrameSelectProps {
  selectedTimeFrame: string;
  onTimeFrameChange: (option: string) => void;
}

const TimeFrameSelect: React.FC<TimeFrameSelectProps> = ({ selectedTimeFrame, onTimeFrameChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: string) => {
    onTimeFrameChange(option);
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
      <label htmlFor="time-frame-select">Time Frame:</label>
      <div className={styles.customSelectWrapper} ref={dropdownRef}>
        <div id="time-frame-select" className={styles.customSelect} onClick={toggleDropdown}>
          <div className={styles.customSelectTrigger}>
            <span>{selectedTimeFrame}</span>
            <div className={styles.arrow}></div>
          </div>
          {isOpen && (
            <div className={styles.customOptions}>
              <span className={`${styles.customOption} ${selectedTimeFrame === 'Past Month' ? styles.selected : ''}`} onClick={() => handleOptionClick('Past Month')}>Past Month</span>
              <span className={`${styles.customOption} ${selectedTimeFrame === 'Past 3 Months' ? styles.selected : ''}`} onClick={() => handleOptionClick('Past 3 Months')}>Past 3 Months</span>
              <span className={`${styles.customOption} ${selectedTimeFrame === 'Past 6 Months' ? styles.selected : ''}`} onClick={() => handleOptionClick('Past 6 Months')}>Past 6 Months</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeFrameSelect;